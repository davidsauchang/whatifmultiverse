// /js/api/auth.js
import { supabase } from "../dbConnect.js";

/**
 * Get the current authenticated user (or null if not signed in)
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("getUser error:", error);
    return null;
  }
  return data.user || null;
}

/**
 * Listen to auth state changes (login/logout)
 * @param {(user: object|null) => void} callback
 */
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}

/**
 * Sign in with email + password
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("signIn error:", error);
    throw error;
  }

  return data.user;
}

/**
 * Sign up with email + password + username
 */
export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: "https://davidsauchang.github.io/whatifmultiverse/verified.html"
    }
  });

  if (error) {
    console.error("signUp error:", error);
    throw error;
  }

  return data.user;
}


/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("signOut error:", error);
    throw error;
  }
}
