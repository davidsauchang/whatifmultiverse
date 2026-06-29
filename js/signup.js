// /js/signup.js
import { supabase } from "./dbConnect.js";
import { getEl } from "./utils/dom.js";
import { showError, tryAsync } from "./utils/errors.js";

const form = getEl("signupForm");
const statusEl = getEl("authMessage");

/**
 * Handle sign-up
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await tryAsync("Signing up", async () => {
    const email = getEl("email").value.trim();
    const password = getEl("password").value.trim();
    const username = getEl("username").value.trim();

    if (!email || !password || !username) {
      showError("authMessage", { message: "All fields are required." });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) {
      showError("authMessage", error);
      return;
    }

    statusEl.textContent = "Account created! Redirecting...";
    window.location.href = "index.html";
  });
});
