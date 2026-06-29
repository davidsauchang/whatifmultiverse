// /js/storyReader.js
import { supabase } from "./dbConnect.js";
import { getStory, isOwner } from "./api/stories.js";
import { listChapters } from "./api/chapters.js";
import { getUser } from "./api/auth.js";
import { getEl, setText, show, hide, createChapterLink } from "./utils/dom.js";

// Get story_id from URL
const params = new URLSearchParams(window.location.search);
const storyId = params.get("story_id");

if (!storyId) {
  alert("Missing story_id");
  throw new Error("Missing story_id");
}

// DOM elements
const titleEl = getEl("storyTitle");
const descEl = getEl("storyDescription");
const coverEl = getEl("storyCover");
const chapterList = getEl("chapterList");

const editCoverBtn = getEl("editCoverBtn");
const editStoryBtn = getEl("editStoryBtn");
const addChapterBtn = getEl("addChapterBtn");

// Set button links
editCoverBtn.href = `editCover.html?story_id=${storyId}`;
editStoryBtn.href = `editStory.html?story_id=${storyId}`;
addChapterBtn.href = `createChapter.html?story_id=${storyId}`;

/**
 * Load story details
 */
async function loadStory() {
  const story = await getStory(storyId);

  setText("storyTitle", story.title);
  setText("storyDescription", story.description);

  if (story.cover_url) {
    coverEl.src = story.cover_url;
  }

  // Load creator username
  if (story.creator_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", story.creator_id)
      .single();

    setText("storyAuthor", `Written by: ${profile?.username || "Unknown"}`);
  }

  // Check ownership
  const user = await getUser();
  const owner = isOwner(story, user);

  if (owner) {
    show("editCoverBtn");
    show("editStoryBtn");
    show("addChapterBtn");
  } else {
    hide("editCoverBtn");
    hide("editStoryBtn");
    hide("addChapterBtn");
  }
}


/**
 * Load chapters
 */
async function loadChapters() {
  const chapters = await listChapters(storyId);

  chapterList.innerHTML = "";

  chapters.forEach(ch => {
    const link = createChapterLink(ch);
    chapterList.appendChild(link);
  });
}

/**
 * Initialize page
 */
async function init() {
  await loadStory();
  await loadChapters();
}

init();
