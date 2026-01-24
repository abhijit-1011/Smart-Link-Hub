import { supabase } from "./supabase.js";
import { checkRules } from "./rules.js";

const hubContainer = document.getElementById("hub-links");
const hubTitle = document.getElementById("hub-title");

// get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  hubTitle.innerText = "Invalid hub link";
  throw new Error("Slug not found");
}

async function loadHub() {
  // 1️⃣ Fetch hub
  const { data: hub, error: hubError } = await supabase
    .from("hubs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (hubError || !hub) {
    hubTitle.innerText = "Hub not found";
    return;
  }

  hubTitle.innerText = hub.title;

  // 2️⃣ Fetch links
  const { data: links, error: linkError } = await supabase
    .from("links")
    .select("*")
    .eq("hub_id", hub.id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (linkError) {
    console.error(linkError);
    return;
  }

  hubContainer.innerHTML = "";

  // 3️⃣ Apply rules + render
  for (let link of links) {
    const allowed = await checkRules(link.id);

    if (!allowed) continue;

    const btn = document.createElement("a");
    btn.href = link.url;
    btn.target = "_blank";
    btn.innerText = link.title;
    btn.className = "hub-btn";

    btn.addEventListener("click", () => {
      trackClick(link.id, hub.user_id);
    });

    hubContainer.appendChild(btn);
  }
}

async function trackClick(linkId, userId) {
  await supabase.from("click_events").insert({
    link_id: linkId,
    owner_id: userId,
    clicked_at: new Date()
  });
}

loadHub();
