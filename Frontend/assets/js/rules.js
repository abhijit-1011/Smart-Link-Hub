import { supabase } from "./supabase.js";

/*
  Rules Engine (Frontend)
  - Calls Supabase Edge Function
  - Returns true / false
*/

export async function checkRules(linkId) {
  try {
    // Detect device
    const device = /Mobi/i.test(navigator.userAgent)
      ? "mobile"
      : "desktop";

    const response = await fetch(
      "https://nyghnjxdokohsolgxcml.supabase.co/functions/v1/quick-task",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabase.anonKey}`
        },
        body: JSON.stringify({
          link_id: linkId,
          context: {
            country: "IN",   // static for now
            device: device
          }
        })
      }
    );

    const result = await response.json();
    return result.visible === true;

  } catch (err) {
    console.error("Rules check failed:", err);
    return true; // fail-safe: show link
  }
}
