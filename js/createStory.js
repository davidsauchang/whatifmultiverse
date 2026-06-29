import { supabase } from "./dbConnect.js";

const form = document.getElementById("create-story-form");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.textContent = "Creating story...";

  // Get logged-in user
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    statusEl.textContent = "You must be signed in.";
    return;
  }

  // Form values
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const cover_url = document.getElementById("cover_url").value.trim();
  const tags = document.getElementById("tags").value
    .split(",")
    .map(t => t.trim())
    .filter(t => t.length > 0);

  // Insert into DB
  const { data, error } = await supabase
    .from("stories")
    .insert({
      title,
      description,
      cover_url,
      tags,
      user_id: user.id,
      creator_id: user.id   // keep this if you want creator profiles
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    statusEl.textContent = "Error: " + error.message;
    return;
  }

  statusEl.textContent = "Story created! Redirecting...";

  // Redirect to story page
  window.location.href = `story.html?story_id=${data.id}`;
});
