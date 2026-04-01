import { supabase, getPublicAudioUrl } from "@/integrations/supabase/client";

const BUCKET = "audio";

/**
 * Upload an audio blob to Supabase Storage.
 * @param blob - The audio file blob
 * @param path - Storage path (e.g., "words/u0633-u0644-u0627-u0645.mp3")
 * @returns The public URL of the uploaded file
 */
export const uploadAudio = async (blob: Blob, path: string): Promise<string> => {
  // Ensure path has .mp3 extension
  const storagePath = path.endsWith(".mp3") ? path : `${path}.mp3`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, blob, {
      cacheControl: "3600",
      upsert: true,
      contentType: "audio/mpeg",
    });

  if (error) {
    throw new Error(`Failed to upload audio: ${error.message}`);
  }

  return getPublicAudioUrl(storagePath);
};

/**
 * Check if an audio file exists in Supabase Storage.
 */
export const audioExists = async (path: string): Promise<boolean> => {
  const storagePath = path.endsWith(".mp3") ? path : `${path}.mp3`;
  const folder = storagePath.split("/").slice(0, -1).join("/");
  const filename = storagePath.split("/").pop()!;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folder, { search: filename });

  if (error) return false;
  return data.some((f) => f.name === filename);
};

/**
 * Get the public URL for an audio file in Supabase Storage.
 * Returns the URL regardless of whether the file exists.
 */
export const getAudioUrl = (path: string): string => {
  const storagePath = path.endsWith(".mp3") ? path : `${path}.mp3`;
  return getPublicAudioUrl(storagePath);
};
