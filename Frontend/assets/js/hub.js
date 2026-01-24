import { supabase } from "./supabase.js";
import { checkRules } from "./rules.js";

const hubContainer = document.getElementById("hub-links");
const hubTitle = document.getElementById("hub-title");

// Get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  hubTitle.innerText = "Invalid Hub Link";
  throw new Error("Slug not found");
}

async function loadHub() {

  // Fetch Hub
  const { data: hub, error: hubError } = await supabase
    .from("hubs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (hubError || !hub) {
    hubTitle.innerText = "Hub not found";
    console.error(hubError);
    return;
  }

  hubTitle.innerText = hub.title;

  // Fetch Links
  const { data: links, error: linkError } = await supabase
    .from("links")
    .select("*")
    .eq("hub_id", hub.id)
    .eq("is_active", true)
    .order("position");

  if (linkError) {
    console.error(linkError);
    return;
  }

  hubContainer.innerHTML = "";

  // Render links
  for (let link of links) {

    const allowed = await checkRules(link.id);
    if (!allowed) continue;

    const btn = document.createElement("a");

    btn.href = link.url;
    btn.target = "_blank";
    btn.innerText = link.title;
    btn.className = "hub-btn";

    // Track click
    btn.addEventListener("click", () => {
      trackClick(link.id);
    });

    hubContainer.appendChild(btn);
  }
}

// Analytics insert
async function trackClick(linkId) {

  const { error } = await supabase
    .from("click_events")
    .insert({
      link_id: linkId,
      user_agent: navigator.userAgent,
      country: "Unknown",
      clicked_at: new Date().toISOString()
    });

  if (error) {
    console.error("Click Error:", error.message);
  }
}

loadHub();
