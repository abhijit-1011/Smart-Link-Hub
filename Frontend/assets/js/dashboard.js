import { supabase } from "./supabase.js";

let user = null;
let currentHub = null;

// Load when page opens
async function init() {

  // Get logged user
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
    return;
  }

  user = data.user;

  await loadHub();
  await loadLinks();
  await loadAnalytics();
}

//
// Create / Load Hub
//
async function loadHub() {

  const { data: hub } = await supabase
    .from("hubs")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (hub) {
    currentHub = hub;
    document.getElementById("hubTitle").value = hub.title;

    // Public button
    document.getElementById("viewPublicBtn").onclick = () => {
      window.open(`hub.html?slug=${hub.slug}`, "_blank");
    };

    return;
  }

  // If no hub → create one
  const slug = user.email.split("@")[0] + Date.now();

  const { data: newHub, error } = await supabase
    .from("hubs")
    .insert({
      user_id: user.id,
      title: "My Smart Hub",
      slug: slug,
      theme: "dark"
    })
    .select()
    .single();

  if (error) {
    console.error("Hub create error:", error.message);
    return;
  }

  currentHub = newHub;
}

//
// Load Links
//
async function loadLinks() {

  if (!currentHub) return;

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("hub_id", currentHub.id)
    .order("position");

  const list = document.getElementById("linksList");
  list.innerHTML = "";

  links.forEach(link => {

    const li = document.createElement("li");
    li.innerText = link.title + " → " + link.url;

    list.appendChild(li);
  });
}

//
// Add Link
//
document.getElementById("addLinkBtn").addEventListener("click", async () => {

  const title = document.getElementById("linkTitle").value.trim();
  const url = document.getElementById("linkUrl").value.trim();

  if (!title || !url || !currentHub) return;

  const { error } = await supabase
    .from("links")
    .insert({
      hub_id: currentHub.id,
      title: title,
      url: url,
      is_active: true,
      position: Date.now()
    });

  if (error) {
    console.error("Add link error:", error.message);
    return;
  }

  document.getElementById("linkTitle").value = "";
  document.getElementById("linkUrl").value = "";

  await loadLinks();
});

//
// Analytics
//
async function loadAnalytics() {

  if (!currentHub) return;

  const { count } = await supabase
    .from("click_events")
    .select("*", { count: "exact", head: true });

  document.getElementById("totalClicks").innerText =
    count || 0;
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html";
});

init();
