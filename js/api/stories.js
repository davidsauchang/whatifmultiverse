// /js/api/stories.js
import { supabase } from "../dbConnect.js";

/**
 * Create a new story
 */
export async function createStory({ user_id, title, description, cover_url, tags }) {
  const { data, error } = await supabase
    .from("stories")
    .insert({
      user_id,
      title,
      description,
      cover_url,
      tags
    })
    .select()
    .single();

  if (error) {
    console.error("createStory error:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch a single story by ID
 */
export async function getStory(storyId) {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", storyId)
    .single();

  if (error) {
    console.error("getStory error:", error);
    throw error;
  }

  return data;
}

/**
 * Update story title/description
 */
export async function updateStory(storyId, { title, description }) {
  const { data, error } = await supabase
    .from("stories")
    .update({ title, description })
    .eq("id", storyId)
    .select()
    .single();

  if (error) {
    console.error("updateStory error:", error);
    throw error;
  }

  return data;
}

/**
 * Update story cover URL
 */
export async function updateCover(storyId, cover_url) {
  const { data, error } = await supabase
    .from("stories")
    .update({ cover_url })
    .eq("id", storyId)
    .select()
    .single();

  if (error) {
    console.error("updateCover error:", error);
    throw error;
  }

  return data;
}

/**
 * List all stories (homepage)
 */
export async function listStories() {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listStories error:", error);
    throw error;
  }

  return data;
}

/**
 * Check if a given user owns a story
 */
export function isOwner(story, user) {
  if (!story || !user) return false;
  return story.user_id === user.id;
}
