import { supabase } from "./supabase.js";

let user = null;
let currentHub = null;

// ---------- Helpers ----------
function $(id) {
  return document.getElementById(id);
}

function setMsg(el, text = "", isError = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("err", !!isError);
}

function buildHubUrl(slug) {
  return `${window.location.origin}/hub.html?slug=${encodeURIComponent(slug)}`;
}

function validSlug(slug) {
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

function setPublicButtons(slug) {
  const link = slug ? buildHubUrl(slug) : "";
  const input = $("publicLink");
  const copyBtn = $("copyPublicBtn");
  const openBtn = $("openPublicBtn");
  const viewBtn = $("viewPublicBtn");

  if (input) input.value = link;

  if (copyBtn) {
    copyBtn.onclick = async () => {
      if (!link) return alert("Save hub to generate link.");
      await navigator.clipboard.writeText(link);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
    };
  }

  if (openBtn) {
    openBtn.onclick = () => {
      if (!link) return alert("Save hub to generate link.");
      window.open(link, "_blank", "noopener");
    };
  }

  if (viewBtn) {
    viewBtn.onclick = () => {
      if (!link) return alert("Save hub to generate link.");
      window.open(link, "_blank", "noopener");
    };
  }
}

// ---------- Init ----------
async function init() {
  const { data } = await supabase.auth.getUser();
  user = data?.user;

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  await loadHubIfExists();
  await loadLinks();
  await loadAnalyticsOverview();
  setUpButtons();
}

function setUpButtons() {
  const saveHubBtn = $("saveHubBtn");
  const addLinkBtn = $("addLinkBtn");

  if (saveHubBtn) saveHubBtn.addEventListener("click", saveHub);
  if (addLinkBtn) addLinkBtn.addEventListener("click", addLink);
}

// ---------- Hub ----------
async function loadHubIfExists() {
  const hubMsg = $("hubMsg");

  const { data: hub, error } = await supabase
    .from("hubs")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Hub load error:", error);
    setMsg(hubMsg, "Failed to load hub: " + error.message, true);
    setPublicButtons("");
    return;
  }

  if (!hub) {
    currentHub = null;
    setMsg(hubMsg, "No hub found. Fill details and click Save Hub.");
    setPublicButtons("");
    return;
  }

  currentHub = hub;

  $("hubTitle").value = hub.title || "";
  $("hubSlug").value = hub.slug || "";
  $("hubTheme").value = hub.theme || "dark";

  setMsg(hubMsg, "Hub loaded.");
  setPublicButtons(hub.slug);
}

async function saveHub() {
  const hubTitle = $("hubTitle").value.trim();
  const hubSlug = $("hubSlug").value.trim();
  const hubTheme = $("hubTheme").value;
  const hubMsg = $("hubMsg");

  setMsg(hubMsg, "");

  if (!hubTitle || !hubSlug) {
    setMsg(hubMsg, "Title and Slug are required.", true);
    return;
  }

  if (!validSlug(hubSlug)) {
    setMsg(hubMsg, "Slug allowed: letters, numbers, - and _ (no spaces).", true);
    return;
  }

  // upsert by slug (needs UNIQUE constraint on hubs.slug)
  const payload = {
    user_id: user.id,
    title: hubTitle,
    slug: hubSlug,
    theme: hubTheme
  };

  const { data, error } = await supabase
    .from("hubs")
    .upsert(payload, { onConflict: "slug" })
    .select()
    .single();

  if (error) {
    console.error("Save hub error:", error);
    setMsg(hubMsg, "Failed to save hub: " + error.message, true);
    return;
  }

  currentHub = data;
  setMsg(hubMsg, "Hub saved successfully.");
  setPublicButtons(data.slug);

  await loadLinks();
  await loadAnalyticsOverview();
}

// ---------- Links ----------
async function loadLinks() {
  const linkList = $("linkList");
  if (!linkList) return;

  if (!currentHub) {
    linkList.innerHTML = `<p style="color:#9ca3af">Save hub first.</p>`;
    return;
  }

  // Use created_at order (works even if "position" column doesn't exist)
  const { data, error } = await supabase
    .from("links")
    .select("id, hub_id, title, url, is_active, created_at")
    .eq("hub_id", currentHub.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Load links error:", error);
    linkList.innerHTML = `<p style="color:#ff6b6b">Failed to load links: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    linkList.innerHTML = `<p style="color:#9ca3af">No links added yet.</p>`;
    return;
  }

  linkList.innerHTML = "";

  data.forEach((l) => {
    const div = document.createElement("div");
    div.className = "link-item";
    div.innerHTML = `
      <div class="link-info">
        <h4>${escapeHtml(l.title || "")}</h4>
        <p>${escapeHtml(l.url || "")}</p>
      </div>
      <button class="btn btn-red" type="button">Delete</button>
    `;

    div.querySelector("button").addEventListener("click", async () => {
      await supabase.from("links").delete().eq("id", l.id);
      await loadLinks();
      await loadAnalyticsOverview();
    });

    linkList.appendChild(div);
  });
}

async function addLink() {
  const linkTitle = $("linkTitle").value.trim();
  const linkUrl = $("linkUrl").value.trim();
  const linkMsg = $("linkMsg");

  setMsg(linkMsg, "");

  if (!currentHub) {
    setMsg(linkMsg, "Save your hub first.", true);
    return;
  }

  if (!linkTitle || !linkUrl) {
    setMsg(linkMsg, "Title and URL are required.", true);
    return;
  }

  // Insert WITHOUT position (so it won't crash if column not present)
  const { error } = await supabase.from("links").insert({
    hub_id: currentHub.id,
    title: linkTitle,
    url: linkUrl,
    is_active: true
  });

  if (error) {
    console.error("Add link error:", error);
    setMsg(linkMsg, "Failed to add link: " + error.message, true);
    return;
  }

  $("linkTitle").value = "";
  $("linkUrl").value = "";
  setMsg(linkMsg, "Link saved.");

  await loadLinks();
  await loadAnalyticsOverview();
}

// ---------- Analytics ----------
async function loadAnalyticsOverview() {
  // defaults
  $("totalVisits").textContent = "0";
  $("totalClicks").textContent = "0";
  $("topLink").textContent = "—";

  if (!currentHub) return;

  // 1) Visits (requires hub_visits table + policies)
  const { count: visitCount, error: vErr } = await supabase
    .from("hub_visits")
    .select("id", { count: "exact", head: true })
    .eq("hub_id", currentHub.id);

  if (!vErr) {
    $("totalVisits").textContent = String(visitCount || 0);
  } else {
    console.warn("Visits not loading:", vErr.message);
  }

  // 2) Clicks count (filter by current hub!)
  const { count: clickCount, error: cErr } = await supabase
    .from("click_events")
    .select("id", { count: "exact", head: true })
    .eq("hub_id", currentHub.id);

  if (!cErr) {
    $("totalClicks").textContent = String(clickCount || 0);
  } else {
    console.warn("Clicks not loading:", cErr.message);
  }

  // 3) Top link (get click list + link titles)
  const { data: clicks, error: topErr } = await supabase
    .from("click_events")
    .select("link_id, links(title)")
    .eq("hub_id", currentHub.id);

  if (topErr) {
    console.warn("Top link not loading:", topErr.message);
    return;
  }

  const map = {};
  (clicks || []).forEach((c) => {
    const title = c?.links?.title || "Unknown";
    map[title] = (map[title] || 0) + 1;
  });

  let best = "—";
  let bestCnt = 0;
  for (const [t, cnt] of Object.entries(map)) {
    if (cnt > bestCnt) {
      bestCnt = cnt;
      best = t;
    }
  }

  $("topLink").textContent = best;
}

// ---------- Security helper ----------
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
