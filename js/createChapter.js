// /js/createChapter.js
import { supabase } from "./dbConnect.js";
import { getUser } from "./api/auth.js";
import { getEl } from "./utils/dom.js";

// Read story_id from URL
const params = new URLSearchParams(window.location.search);
const storyId = params.get("story_id");
const parentId = params.get("parent_id");


if (!storyId) {
  alert("Missing story_id");
  throw new Error("Missing story_id");
}

// Form elements
const form = getEl("chapterForm");
const titleEl = getEl("chapterTitle");
const contentEl = getEl("chapterContent");

/* -----------------------------------------
   AUTO TITLE FOR BRANCHES (What if… logic)
   ----------------------------------------- */

if (parentId) {
  // Load the parent chapter to get its chapter_order
  const { data: parentChapter, error: parentErr } = await supabase
    .from("chapters")
    .select("chapter_order")
    .eq("id", parentId)
    .single();

  if (parentErr) {
    console.error("Failed to load parent chapter", parentErr);
  } else {
    const nextNumber = parentChapter.chapter_order + 1;
    const basePrefix = `Chapter ${nextNumber}: `;

    // Auto-fill the title
    titleEl.value = `${basePrefix}What if `;

    // Lock the chapter number portion
    titleEl.addEventListener("input", () => {
      if (!titleEl.value.startsWith(basePrefix)) {
        titleEl.value = `${basePrefix}What if `;
      }
    });
  }
}


// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = await getUser();
  if (!user) {
    alert("You must be logged in to create a chapter.");
    return;
  }

  const title = titleEl.value.trim();
  const content = contentEl.value.trim();

  if (!title || !content) {
    alert("Please fill in all fields.");
    return;
  }

  // ⭐ Get current chapter count
  const { data: existingChapters, error: countError } = await supabase
    .from("chapters")
    .select("id", { count: "exact" })
    .eq("story_id", storyId);

  if (countError) {
    console.error(countError);
    alert("Failed to count chapters.");
    return;
  }

  const chapter_order = existingChapters.length + 1;

  // ⭐ Insert chapter with required chapter_order
  const { data, error } = await supabase
    .from("chapters")
    .insert({
      story_id: storyId,
      title,
      content,
      chapter_order
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating chapter:", error);
    alert("Failed to create chapter.");
    return;
  }

  // Redirect back to story page
  window.location.href = `story.html?story_id=${storyId}`;
});
