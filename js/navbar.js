// /js/navbar.js
import { getUser, onAuthChange, signOut } from "./api/auth.js";
import { getEl } from "./utils/dom.js";

const navAuth = getEl("nav-auth");

/**
 * Render navbar based on user state
 */
function renderNavbar(user) {
  const desktopAuth = document.getElementById("nav-auth");
  const mobileAuth = document.getElementById("nav-auth-mobile");

  const html = user
    ? `
      <a href="./create-story.html" class="nav-btn">Create Story</a>
      <a id="signOutBtn" class="nav-btn">Sign Out</a>
    `
    : `
      <a href="signin.html" class="nav-btn">Sign In</a>
      <a href="signup.html" class="nav-btn">Sign Up</a>
    `;

  desktopAuth.innerHTML = html;
  mobileAuth.innerHTML = html;

  // Attach sign-out handler (desktop + mobile)
  const btn = document.getElementById("signOutBtn");
  if (btn) {
    btn.addEventListener("click", async () => {
      await signOut();
      window.location.href = "index.html";
    });
  }
}



/**
 * MOBILE MENU (slide-in drawer)
 */
const hamburger = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

if (hamburger && mobileMenu && closeMenu) {
  hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("show");

  if (isOpen) {
    mobileMenu.classList.remove("show");
    hamburger.classList.remove("active");
  } else {
    mobileMenu.classList.add("show");
    hamburger.classList.add("active");
  }
});


  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("show");
    hamburger.classList.remove("active");
  });
}

/**
 * Initialize navbar
 */
async function initNavbar() {
  const user = await getUser();
  renderNavbar(user);

  // Live updates on login/logout
  onAuthChange(renderNavbar);
}

initNavbar();
