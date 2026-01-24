import { supabase } from "./supabase.js";

const container = document.getElementById("analytics");

// get user
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  if (container) container.innerText = "Please login to view analytics";
  throw new Error("Not logged in");
}

async function loadAnalytics() {
  if (!container) return;

  // 1) Get this user's hub
  const { data: hub, error: hubErr } = await supabase
    .from("hubs")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (hubErr || !hub) {
    container.innerText = "No hub found. Create your hub first.";
    return;
  }

  // 2) Get clicks for links belonging to this hub
  // We fetch click_events with link_id and join links(title, hub_id)
  const { data: clicks, error } = await supabase
    .from("click_events")
    .select(`
      id,
      link_id,
      clicked_at,
      links ( id, title, hub_id )
    `)
    .order("clicked_at", { ascending: false });

  if (error) {
    console.error(error);
    container.innerText = "Failed to load analytics";
    return;
  }

  // Filter only clicks of this hub
  const filtered = (clicks || []).filter(c => c.links?.hub_id === hub.id);

  if (!filtered.length) {
    container.innerText = "No clicks yet";
    return;
  }

  // Aggregate clicks per link title
  const stats = {};
  filtered.forEach(c => {
    const title = c.links?.title || "Unknown Link";
    stats[title] = (stats[title] || 0) + 1;
  });

  // Render
  container.innerHTML = "";
  Object.entries(stats).forEach(([title, count]) => {
    const div = document.createElement("div");
    div.className = "stat-card";
    div.innerHTML = `
      <strong>${title}</strong>
      <p>Total Clicks: ${count}</p>
    `;
    container.appendChild(div);
  });
}

loadAnalytics();
