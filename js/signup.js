import { supabase } from "./dbConnect.js";

const signupForm = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const errorBox = document.getElementById("error-box");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // Confirm password check
  if (password !== confirmPassword) {
    errorBox.textContent = "Passwords do not match.";
    return;
  }

  try {
    // Create Auth user with metadata + redirect
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: "https://YOUR_GITHUB_USERNAME.github.io/whatifmultiverse/verified.html"
      }
    });

    if (error) {
      errorBox.textContent = error.message;
      return;
    }

    // Insert profile row manually (trigger won't fire after metadata update)
    const userId = data.user.id;

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        username: username
      });

    if (profileError) {
      errorBox.textContent = "Profile creation failed: " + profileError.message;
      return;
    }

    // Redirect to "Check your email" page
    window.location.href = "check-email.html";

  } catch (err) {
    errorBox.textContent = "Unexpected error: " + err.message;
  }
});
