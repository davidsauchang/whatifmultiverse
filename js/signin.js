// /js/signin.js
import { supabase } from "./dbConnect.js";
import { getEl } from "./utils/dom.js";
import { showError, tryAsync } from "./utils/errors.js";

const form = getEl("signinForm");
const statusEl = getEl("authMessage");

/**
 * Handle sign-in
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await tryAsync("Signing in", async () => {
    const email = getEl("email").value.trim();
    const password = getEl("password").value.trim();

    if (!email || !password) {
      showError("authMessage", { message: "Email and password are required." });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showError("authMessage", error);
      return;
    }

    statusEl.textContent = "Success! Redirecting...";
    window.location.href = "index.html";
  });
});
