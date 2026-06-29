// /js/api/chapters.js
import { supabase } from "../dbConnect.js";

/**
 * Create a new chapter for a story
 */
export async function createChapter({ story_id, title, content }) {
  // Count existing chapters to auto‑assign chapter_order
  const { data: existing, error: countError } = await supabase
    .from("chapters")
    .select("id", { count: "exact" })
    .eq("story_id", story_id);

  if (countError) {
    console.error("createChapter count error:", countError);
    throw countError;
  }

  const chapter_order = (existing?.length || 0) + 1;

  const { data, error } = await supabase
    .from("chapters")
    .insert({
      story_id,
      title,
      content,
      chapter_order
    })
    .select()
    .single();

  if (error) {
    console.error("createChapter insert error:", error);
    throw error;
  }

  return data;
}

/**
 * Get a single chapter by ID
 */
export async function getChapter(chapterId) {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", chapterId)
    .single();

  if (error) {
    console.error("getChapter error:", error);
    throw error;
  }

  return data;
}

/**
 * List all chapters for a story, ordered properly
 */
export async function listChapters(storyId) {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("story_id", storyId)
    .order("chapter_order", { ascending: true });

  if (error) {
    console.error("listChapters error:", error);
    throw error;
  }

  return data;
}

/**
 * Update a chapter (future‑proof)
 */
export async function updateChapter(chapterId, fields) {
  const { data, error } = await supabase
    .from("chapters")
    .update(fields)
    .eq("id", chapterId)
    .select()
    .single();

  if (error) {
    console.error("updateChapter error:", error);
    throw error;
  }

  return data;
}

/**
 * Delete a chapter (future‑proof)
 */
export async function deleteChapter(chapterId) {
  const { error } = await supabase
    .from("chapters")
    .delete()
    .eq("id", chapterId);

  if (error) {
    console.error("deleteChapter error:", error);
    throw error;
  }
}
