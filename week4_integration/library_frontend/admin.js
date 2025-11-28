// admin.js
const API_BASE = "http://localhost/library_backend/admin";

let allAdmins = []; // stored for search

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  fetchAdmins();
});

// ==========================
// INIT UI
// ==========================
function initUI() {
  document.getElementById("btn-add-admin").addEventListener("click", openAddModal);
  document.getElementById("admin-modal-close").addEventListener("click", closeModal);
  document.getElementById("admin-cancel").addEventListener("click", closeModal);
  document.getElementById("admin-form").addEventListener("submit", onSubmitForm);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", onSearch);
  }
}

// ==========================
// FETCH ADMINS
// ==========================
async function fetchAdmins() {
  const tbody = document.getElementById("admin-tbody");
  renderSkeleton(tbody, 6, 5);

  try {
    const res = await fetch(`${API_BASE}/get_admin.php`);
    allAdmins = await res.json();
    renderTable(allAdmins);
  } catch (err) {
    console.error(err);
    alert("Failed to load admins.");
  }
}


// ==========================
// SEARCH
// ==========================
function onSearch() {
  const q = searchInput.value.toLowerCase();

  const filtered = allAdmins.filter(a =>
    (a.Name || "").toLowerCase().includes(q) ||
    (a.Email || "").toLowerCase().includes(q) ||
    (a.Phone + "").includes(q)
  );

  renderTable(filtered);
}

// ==========================
// NO RESULTS
// ==========================
function showNoResults(tbody, colSpan) {
  tbody.innerHTML = `
    <tr>
      <td colspan="${colSpan}" class="no-results">
        No matching records found.
      </td>
    </tr>
  `;
}

function renderSkeleton(tbody, rows, cols) {
    tbody.innerHTML = "";
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement("tr");
      tr.classList.add("skeleton-row");
  
      let tds = "";
      for (let j = 0; j < cols; j++) {
        tds += `<td><div class="skeleton-box"></div></td>`;
      }
  
      tr.innerHTML = tds;
      tbody.appendChild(tr);
    }
  }
  

// ==========================
// RENDER TABLE
// ==========================
function renderTable(list) {
  const tbody = document.getElementById("admin-tbody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    showNoResults(tbody, 5);
    return;
  }

  list.forEach((a, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(a.Name)}</td>
      <td>${escapeHtml(a.Email)}</td>
      <td>${escapeHtml(a.Phone)}</td>
      <td>
        <button class="action-btn edit" onclick='openEditModal(${JSON.stringify(a)})'>Edit</button>
        <button class="action-btn delete" onclick="deleteAdmin(${a.AdminID})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================
// MODAL HANDLING
// ==========================
function openAddModal() {
  clearForm();
  document.getElementById("admin-modal-title").innerText = "Add Admin";
  openModal();
}

function openEditModal(a) {
  if (typeof a === "string") a = JSON.parse(a);

  document.getElementById("admin-modal-title").innerText = "Edit Admin";

  document.getElementById("admin-id").value = a.AdminID;
  document.getElementById("a-name").value = a.Name || "";
  document.getElementById("a-email").value = a.Email || "";
  document.getElementById("a-phone").value = a.Phone || "";

  openModal();
}

function openModal() {
  const modal = document.getElementById("admin-modal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("admin-modal");

  modal.classList.add("closing");
  setTimeout(() => {
    modal.classList.remove("closing");
    modal.style.display = "none";
  }, 200);
}

function clearForm() {
  document.getElementById("admin-id").value = "";
  document.getElementById("admin-form").reset();
}

// ==========================
// SUBMIT
// ==========================
async function onSubmitForm(e) {
  e.preventDefault();

  const id = document.getElementById("admin-id").value;
  const url = id
    ? `${API_BASE}/update_admin.php`
    : `${API_BASE}/create_admin.php`;

  const formData = new FormData(document.getElementById("admin-form"));
  if (id) formData.append("id", id);

  try {
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (data.status === "success") {
      closeModal();
      fetchAdmins();
    } else {
      alert("Error: " + (data.message || "unknown"));
    }

  } catch (err) {
    console.error(err);
    alert("Network error.");
  }
}

// ==========================
// DELETE ADMIN
// ==========================
async function deleteAdmin(id) {
  if (!confirm(`Delete admin ID ${id}?`)) return;

  const body = new FormData();
  body.append("id", id);

  try {
    const res = await fetch(`${API_BASE}/delete_admin.php`, {
      method: "POST",
      body
    });

    const data = await res.json();

    if (data.status === "success") {
      fetchAdmins();
    } else {
      alert("Delete failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Network error.");
  }
}

// ==========================
// SAFE TEXT
// ==========================
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
