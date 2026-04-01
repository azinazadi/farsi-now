#!/usr/bin/env node
/**
 * Upload locally generated audio assets to Supabase Storage.
 *
 * Usage:
 *   node scripts/upload-audio.mjs            # upload all audio
 *   node scripts/upload-audio.mjs --dry-run   # preview what would be uploaded
 *   node scripts/upload-audio.mjs --force     # re-upload even if file exists
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "public", "assets", "audio");
const BUCKET = "audio";

const SUPABASE_URL = "https://psmzfyxxhnjwviygpers.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PHocKP73fUIiF4LuV9mqJw_W5Cwp3zH";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");

function collectFiles(dir, prefix = "") {
  const entries = [];
  if (!fs.existsSync(dir)) return entries;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const rel = prefix ? `${prefix}/${item}` : item;

    if (fs.statSync(full).isDirectory()) {
      entries.push(...collectFiles(full, rel));
    } else if (item.endsWith(".mp3")) {
      entries.push({ localPath: full, storagePath: rel });
    }
  }
  return entries;
}

async function fileExistsInBucket(storagePath) {
  const folder = path.dirname(storagePath);
  const filename = path.basename(storagePath);
  const listPath = folder === "." ? "" : folder;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(listPath, { search: filename });

  if (error) return false;
  return data.some((f) => f.name === filename);
}

async function upload(localPath, storagePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    cacheControl: "3600",
    upsert: true,
    contentType: "audio/mpeg",
  });

  if (error) {
    throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  }
}

async function main() {
  const files = collectFiles(ASSETS_DIR);

  if (files.length === 0) {
    console.log("No .mp3 files found in public/assets/audio/");
    console.log("Run 'python generate_assets.py' first to generate audio files.");
    process.exit(0);
  }

  console.log(`Found ${files.length} audio files`);
  if (DRY_RUN) console.log("(dry run — no uploads)\n");

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const { localPath, storagePath } of files) {
    if (!FORCE) {
      const exists = await fileExistsInBucket(storagePath);
      if (exists) {
        skipped++;
        continue;
      }
    }

    if (DRY_RUN) {
      console.log(`  Would upload: ${storagePath}`);
      uploaded++;
      continue;
    }

    try {
      await upload(localPath, storagePath);
      console.log(`  ✓ ${storagePath}`);
      uploaded++;
    } catch (err) {
      console.error(`  ✗ ${storagePath}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
