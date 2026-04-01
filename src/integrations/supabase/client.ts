import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://psmzfyxxhnjwviygpers.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PHocKP73fUIiF4LuV9mqJw_W5Cwp3zH";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getPublicAudioUrl = (path: string): string => {
  const { data } = supabase.storage.from("audio").getPublicUrl(path);
  return data.publicUrl;
};
