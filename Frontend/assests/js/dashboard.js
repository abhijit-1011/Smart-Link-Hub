import { supabase } from "./supabase.js";

const linkList = document.getElementById("link-list");
const addForm = document.getElementById("add-link-form");

// get logged-in user
const {
  data: { user }
} = await supabase.auth.getUser();

if (!user) {
  alert("Please login first");
  window.location.href = "index.html";
}

// load links
async function loadLinks() {
  const { data: links, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  linkList.innerHTML = "";

  links.forEach(link => {
    const li = document.createElement("li");
    li.className = "link-item";

    li.innerHTML = `
      <span>${link.title}</span>
      <button onclick="toggleLink('${link.id}', ${link.is_active})">
        ${link.is_active ? "Disable" : "Enable"}
      </button>
      <button onclick="deleteLink('${link.id}')">Delete</button>
    `;

    linkList.appendChild(li);
  });
}

// add new link
addForm.addEventListener("submit", async e => {
  e.preventDefault();

  const title = addForm.title.value;
  const url = addForm.url.value;

  const { error } = await supabase.from("links").insert({
    user_id: user.id,
    title,
    url,
    is_active: true
  });

  if (error) {
    alert("Error adding link");
    return;
  }

  addForm.reset();
  loadLinks();
});

// enable / disable
window.toggleLink = async (id, active) => {
  await supabase
    .from("links")
    .update({ is_active: !active })
    .eq("id", id);

  loadLinks();
};

// delete link
window.deleteLink = async id => {
  if (!confirm("Delete this link?")) return;

  await supabase.from("links").delete().eq("id", id);
  loadLinks();
};

loadLinks();
