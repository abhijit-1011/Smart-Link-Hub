import { supabase } from "./supabase.js";

// Read slug from URL
// Example: hub.html?slug=myhub
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  alert("Invalid hub link");
}

async function loadHub() {
  // Fetch hub
  const { data: hub, error: hubError } = await supabase
    .from("hubs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (hubError) {
    alert("Hub not found");
    return;
  }

  document.getElementById("hub-title").textContent = hub.title;

  // Fetch links
  const { data: links, error } = await supabase
    .from("links")
    .select("*")
    .eq("hub_id", hub.id)
    .eq("is_active", true)
    .order("order_index");

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("links");
  container.innerHTML = "";

  links.forEach(link => {
    const a = document.createElement("a");
    a.href = link.url;
    a.textContent = link.title;
    a.target = "_blank";
    a.className = "hub-link";

    container.appendChild(a);
  });
}

loadHub();
