// /js/utils/errors.js

/**
 * Log a detailed error to the console (for developers)
 */
export function logError(context, error) {
  console.error(`❌ ${context}:`, error?.message || error);
}

/**
 * Convert a Supabase/Postgres error into a user-friendly message
 */
export function friendlyError(error) {
  if (!error) return "An unknown error occurred.";

  // Common Supabase/Postgres patterns
  const msg = error.message || "";

  if (msg.includes("duplicate key")) return "This item already exists.";
  if (msg.includes("foreign key")) return "Linked data is missing or invalid.";
  if (msg.includes("permission denied")) return "You do not have permission.";
  if (msg.includes("invalid input")) return "Some fields contain invalid data.";
  if (msg.includes("null value")) return "A required field was left empty.";

  // Default fallback
  return msg || "Something went wrong.";
}

/**
 * Display an error message in a DOM element
 */
export function showError(id, error) {
  const el = document.getElementById(id);
  if (!el) {
    console.error(`Error element "${id}" not found`);
    return;
  }
  el.textContent = friendlyError(error);
  el.style.color = "red";
}

/**
 * Wrap async operations with automatic error handling
 */
export async function tryAsync(context, fn) {
  try {
    return await fn();
  } catch (error) {
    logError(context, error);
    throw error;
  }
}
