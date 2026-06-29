// /js/utils/dom.js

/**
 * Safe element lookup by ID
 * Throws a clear error if the element doesn't exist
 */
export function getEl(id) {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Element with ID "${id}" not found`);
  }
  return el;
}

/**
 * Set text content safely
 */
export function setText(id, text) {
  const el = getEl(id);
  el.textContent = text;
}

/**
 * Show an element (inline-block by default)
 */
export function show(id, display = "inline-block") {
  const el = getEl(id);
  el.style.display = display;
}

/**
 * Hide an element
 */
export function hide(id) {
  const el = getEl(id);
  el.style.display = "none";
}

/**
 * Create a chapter link element
 */
export function createChapterLink(chapter) {
  const link = document.createElement("a");
  link.href = `readChapter.html?chapter_id=${chapter.id}`;
  link.textContent = chapter.title;
  link.classList.add("chapter-link");

  const wrapper = document.createElement("div");
  wrapper.appendChild(link);

  return wrapper;
}

/**
 * Fade-in animation for story cards
 */
export function animateCards(cards) {
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, i * 150);
  });
}
