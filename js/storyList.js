// /js/storyList.js
import { listStories } from "./api/stories.js";
import { animateCards } from "./utils/dom.js";

const container = document.getElementById("storyContainer");

/**
 * Build a single story card element
 */
function createStoryCard(story) {
  const card = document.createElement("a");
  card.href = `story.html?story_id=${story.id}`;
  card.className = "story-card";

  card.innerHTML = `
  <img src="${story.cover_url || 'assets/default-cover.png'}" class="story-cover" />
  <div class="story-card-text">
    <h3 class="story-title">${story.title}</h3>
    <p class="story-desc">${story.description || ""}</p>
  </div>
`;


  // Start hidden for animation
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";

  return card;
}

/**
 * Load and render all stories
 */
async function loadStories() {
  const stories = await listStories();

  container.innerHTML = "";

  const cards = stories.map(story => {
    const card = createStoryCard(story);
    container.appendChild(card);
    return card;
  });

  // Fade-in animation
  animateCards(cards);
}

loadStories();

// View toggle buttons
const thumbBtn = document.getElementById("thumbView");
const listBtn = document.getElementById("listView");

// Switch to Thumbnail View
thumbBtn.addEventListener("click", () => {
  container.classList.add("thumbnail");
  container.classList.remove("list");

  thumbBtn.classList.add("active");
  listBtn.classList.remove("active");
});

// Switch to List View
listBtn.addEventListener("click", () => {
  container.classList.add("list");
  container.classList.remove("thumbnail");

  listBtn.classList.add("active");
  thumbBtn.classList.remove("active");
});

import { getUser } from "./api/auth.js";

const startBtn = document.getElementById("startStoryBtn");

if (startBtn) {
  startBtn.addEventListener("click", async () => {
    const user = await getUser();

    if (!user) {
      window.location.href = "signin.html";   // or login.html if that's your file
    } else {
      window.location.href = "create-story.html";
    }
  });
}
