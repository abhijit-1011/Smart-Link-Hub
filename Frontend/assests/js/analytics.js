import { supabase } from "./supabase.js";

const container = document.getElementById("analytics");

// get user
const {
  data: { user }
} = await supabase.auth.getUser();

if (!user) {
  container.innerText = "Please login to view analytics";
  throw new Error("Not logged in");
}

async function loadAnalytics() {
  // fetch clicks
  const { data: clicks, error } = await supabase
    .from("click_events")
    .select(`
      id,
      link_id,
      clicked_at,
      links ( title )
    `)
    .eq("owner_id", user.id);

  if (error) {
    console.error(error);
    container.innerText = "Failed to load analytics";
    return;
  }

  if (!clicks.length) {
    container.innerText = "No clicks yet";
    return;
  }

  const stats = {};

  // aggregate
  clicks.forEach(c => {
    const title = c.links.title;
    stats[title] = (stats[title] || 0) + 1;
  });

  // render
  container.innerHTML = "";

  for (let title in stats) {
    const div = document.createElement("div");
    div.className = "stat-card";
    div.innerHTML = `
      <strong>${title}</strong>
      <p>Total Clicks: ${stats[title]}</p>
    `;
    container.appendChild(div);
  }
}

loadAnalytics();
