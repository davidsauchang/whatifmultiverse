// /js/editCover.js
import { getStory, updateCover, isOwner } from "./api/stories.js";
import { getUser } from "./api/auth.js";
import { getEl } from "./utils/dom.js";
import { showError, tryAsync } from "./utils/errors.js";
import { supabase } from "./dbConnect.js"; // <-- needed for uploads

// Get story_id from URL
const params = new URLSearchParams(window.location.search);
const storyId = params.get("story_id");

if (!storyId) {
  alert("Missing story_id");
  throw new Error("Missing story_id");
}

// DOM elements
const form = getEl("editCoverForm");
const coverInput = getEl("cover_url");
const preview = getEl("coverPreview");
const statusEl = getEl("statusMessage");

// NEW: upload elements
const uploadBtn = getEl("uploadCoverBtn");
const fileInput = getEl("coverFile");
const uploadStatus = getEl("uploadStatus");

/**
 * Load story and populate form
 */
async function loadStory() {
  const story = await getStory(storyId);
  const user = await getUser();

  if (!isOwner(story, user)) {
    showError("statusMessage", { message: "You do not have permission to edit this cover." });
    form.style.display = "none";
    return;
  }

  // Populate form
  coverInput.value = story.cover_url || "";
  preview.src = story.cover_url || "assets/default-cover.png";
}

/**
 * Live preview when typing
 */
coverInput.addEventListener("input", () => {
  preview.src = coverInput.value.trim() || "assets/default-cover.png";
});

/**
 * ⭐ NEW: Upload to Supabase Storage (JPG/PNG only)
 */
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    uploadStatus.textContent = "Choose a file first.";
    return;
  }

  // Allowed MIME types
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    uploadStatus.textContent = "Only JPG and PNG files are allowed.";
    return;
  }

  uploadStatus.textContent = "Uploading...";

  const filePath = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("covers")
    .upload(filePath, file);

  if (error) {
    uploadStatus.textContent = "Upload failed.";
    console.error(error);
    return;
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from("covers")
    .getPublicUrl(filePath);

  // Fill input + update preview
  coverInput.value = publicData.publicUrl;
  preview.src = publicData.publicUrl;

  uploadStatus.textContent = "Uploaded!";
});

/**
 * Handle cover update
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await tryAsync("Updating cover", async () => {
    const newCover = coverInput.value.trim();

    if (!newCover) {
      showError("statusMessage", { message: "Cover URL cannot be empty." });
      return;
    }

    await updateCover(storyId, newCover);

    statusEl.textContent = "Cover updated!";
    window.location.href = `story.html?story_id=${storyId}`;
  });
});

/**
 * Initialize page
 */
loadStory();
