// /js/readChapter.js
import { getChapter } from "./api/chapters.js";
import { getStory } from "./api/stories.js";
import { getUser } from "./api/auth.js";
import { getEl, setText } from "./utils/dom.js";
import { supabase } from "./dbConnect.js";

// Get chapter_id from URL
const params = new URLSearchParams(window.location.search);
const chapterId = params.get("chapter_id");

if (!chapterId) {
  alert("Missing chapter_id");
  throw new Error("Missing chapter_id");
}

// DOM elements
const titleEl = getEl("chapterTitle");
const contentEl = getEl("chapterContent");
const storyLinkEl = getEl("storyLink");
const createBranchBtn = getEl("createBranchBtn");
const branchListEl = getEl("branchList");

/**
 * Load chapter + parent story
 */
async function loadChapter() {
  const user = await getUser();
  const chapter = await getChapter(chapterId);

  /* ------------------------------
   VIEW TRACKING (1 view per user)
   ------------------------------ */

if (user) {
  // Check if this user already viewed this chapter
  const { data: existingView, error: viewCheckError } = await supabase
    .from("chapter_views")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingView) {
    // Insert a new view record
    const { error: insertError } = await supabase
      .from("chapter_views")
      .insert({
        chapter_id: chapterId,
        user_id: user.id
      });

    if (insertError) {
      console.error("Error inserting view:", insertError);
    }
  }
}

/* ------------------------------
   VIEW COUNT DISPLAY
   ------------------------------ */

const { count: viewCount } = await supabase
  .from("chapter_views")
  .select("*", { count: "exact", head: true })
  .eq("chapter_id", chapterId);

// Add view count under the title
const viewBadge = document.createElement("div");
viewBadge.className = "view-count";
viewBadge.textContent = `👁️ ${viewCount} views`;

titleEl.insertAdjacentElement("afterend", viewBadge);


  // Display chapter content
  setText("chapterTitle", chapter.title);
  contentEl.innerHTML = chapter.content.replace(/\n/g, "<br>");

  // Load parent story for link
  const story = await getStory(chapter.story_id);
  storyLinkEl.href = `story.html?story_id=${story.id}`;
  storyLinkEl.textContent = `← Back to ${story.title}`;

  /* ------------------------------
     PREVIOUS / NEXT CHAPTER LOGIC
     ------------------------------ */

  const { data: allChapters } = await supabase
    .from("chapters")
    .select("*")
    .eq("story_id", chapter.story_id)
    .order("chapter_order", { ascending: true });

  const index = allChapters.findIndex((c) => c.id === chapter.id);
  const prev = allChapters[index - 1];
  const next = allChapters[index + 1];

  const prevTop = document.getElementById("prevChapterBtnTop");
  const nextTop = document.getElementById("nextChapterBtnTop");
  const prevBottom = document.getElementById("prevChapterBtnBottom");
  const nextBottom = document.getElementById("nextChapterBtnBottom");

  // ---- PREVIOUS ----
  if (prev) {
    const url = `readChapter.html?chapter_id=${prev.id}`;

    prevTop.href = url;
    prevBottom.href = url;

    prevTop.style.display = "inline-block";
    prevBottom.style.display = "inline-block";

    prevTop.onclick = () => location.href = url;
    prevBottom.onclick = () => location.href = url;

  } else {
    prevTop.style.display = "none";
    prevBottom.style.display = "none";
  }

  // ---- NEXT ----
  if (next) {
    const url = `readChapter.html?chapter_id=${next.id}`;

    nextTop.href = url;
    nextBottom.href = url;

    nextTop.style.display = "inline-block";
    nextBottom.style.display = "inline-block";

    nextTop.onclick = () => location.href = url;
    nextBottom.onclick = () => location.href = url;

  } else {
    nextTop.style.display = "none";
    nextBottom.style.display = "none";
  }

  /* ------------------------------
     CREATE BRANCH BUTTON
     ------------------------------ */

  // Always allow branching (even on Chapter 1)
createBranchBtn.href = `createChapter.html?story_id=${chapter.story_id}&parent_id=${chapter.id}`;

// Hide branch button if user is not logged in
if (!user) {
  createBranchBtn.style.display = "none";
}


  /* ------------------------------
   BRANCH LIST (Chapter 1 included)
   ------------------------------ */

const { data: branches, error: branchError } = await supabase
  .from("chapters")
  .select("*")
  .eq("chapter_order", chapter.chapter_order + 1)
  .eq("story_id", chapter.story_id);

if (branchError) {
  console.error(branchError);
  branchListEl.innerHTML = "<p>Error loading branches.</p>";
  return;
}

if (!branches || branches.length === 0) {
  branchListEl.innerHTML = "<p class='no-branches'>No branches yet.</p>";
  return;
}

/* Sort so ORIGINAL is first */
const original = branches.find(b => b.parent_chapter_id === null);
const alts = branches.filter(b => b.parent_chapter_id !== null);

const sorted = original ? [original, ...alts] : alts;

branchListEl.innerHTML = `
  <h3>Possible next chapters:</h3>
  <ul>
    ${sorted
      .map(
        (b) =>
          `<li><a href="readChapter.html?chapter_id=${b.id}">${b.title}</a></li>`
      )
      .join("")}
  </ul>
`;

}

/**
 * Initialize page
 */
loadChapter();
