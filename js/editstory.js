// /js/editStory.js
import { getStory, updateStory, isOwner } from "./api/stories.js";
import { getUser } from "./api/auth.js";
import { getEl } from "./utils/dom.js";
import { showError, tryAsync } from "./utils/errors.js";

// Get story_id from URL
const params = new URLSearchParams(window.location.search);
const storyId = params.get("story_id");

if (!storyId) {
  alert("Missing story_id");
  throw new Error("Missing story_id");
}

// DOM elements
const form = getEl("editStoryForm");
const titleInput = getEl("title");
const descInput = getEl("description");
const statusEl = getEl("statusMessage");

/**
 * Load story and populate form
 */
async function loadStory() {
  const story = await getStory(storyId);
  const user = await getUser();

  if (!isOwner(story, user)) {
    showError("statusMessage", { message: "You do not have permission to edit this story." });
    form.style.display = "none";
    return;
  }

  // Populate form
  titleInput.value = story.title || "";
  descInput.value = story.description || "";
}

/**
 * Handle story update
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await tryAsync("Updating story", async () => {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!title) {
      showError("statusMessage", { message: "Title cannot be empty." });
      return;
    }

    await updateStory(storyId, { title, description });

    statusEl.textContent = "Story updated!";
    window.location.href = `story.html?story_id=${storyId}`;
  });
});

/**
 * Initialize page
 */
loadStory();
