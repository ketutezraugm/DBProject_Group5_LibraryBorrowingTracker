// category.js
const API_BASE = "http://localhost/library_backend/category";

let allCategories = []; // for search

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  fetchCategories();
});

// ==========================
// INIT UI
// ==========================
function initUI() {
  document.getElementById("btn-add-category").addEventListener("click", openAddModal);
  document.getElementById("category-modal-close").addEventListener("click", closeModal);
  document.getElementById("category-cancel").addEventListener("click", closeModal);
  document.getElementById("category-form").addEventListener("submit", onSubmitForm);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", onSearch);
  }
}

// ==========================
// FETCH
// ==========================
async function fetchCategories() {
    const tbody = document.getElementById("category-tbody");
    renderSkeleton(tbody, 6, 3);
  
    try {
      const res = await fetch(`${API_BASE}/get_category.php`);
      allCategories = await res.json();
      renderTable(allCategories);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories.");
    }
  }
  

// ==========================
// SEARCH
// ==========================
function onSearch() {
  const q = searchInput.value.toLowerCase();

  const filtered = allCategories.filter(c =>
    (c.CategoryName || "").toLowerCase().includes(q)
  );

  renderTable(filtered);
}

// ==========================
// NO RESULTS MESSAGE
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
  const tbody = document.getElementById("category-tbody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    showNoResults(tbody, 3);
    return;
  }

  list.forEach((c, idx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(c.CategoryName)}</td>
      <td>
        <button class="action-btn edit" onclick='openEditModal(${JSON.stringify(c)})'>Edit</button>
        <button class="action-btn delete" onclick="deleteCategory(${c.CategoryID})">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ==========================
// MODAL
// ==========================
function openAddModal() {
  clearForm();
  document.getElementById("category-modal-title").innerText = "Add Category";
  openModal();
}

function openEditModal(c) {
  if (typeof c === "string") c = JSON.parse(c);

  document.getElementById("category-modal-title").innerText = "Edit Category";

  document.getElementById("c-name").value = c.CategoryName;
  document.getElementById("category-modal").dataset.editId = c.CategoryID;

  openModal();
}

function openModal() {
  const modal = document.getElementById("category-modal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("category-modal");

  modal.classList.add("closing");
  setTimeout(() => {
    modal.classList.remove("closing");
    modal.style.display = "none";
  }, 200);
}

function clearForm() {
  document.getElementById("c-name").value = "";
  delete document.getElementById("category-modal").dataset.editId;
}

// ==========================
// SUBMIT FORM
// ==========================
async function onSubmitForm(e) {
  e.preventDefault();

  const modal = document.getElementById("category-modal");
  const editId = modal.dataset.editId;

  const formData = new FormData();
  formData.append("CategoryName", document.getElementById("c-name").value);

  const url = editId
    ? `${API_BASE}/update_category.php`
    : `${API_BASE}/create_category.php`;

  if (editId) formData.append("CategoryID", editId);

  try {
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (data.status === "success") {
      closeModal();
      fetchCategories();
    } else {
      alert("Error: " + (data.message || "unknown"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error.");
  }
}

// ==========================
// DELETE CATEGORY
// ==========================
async function deleteCategory(id) {
  if (!confirm(`Delete category ID ${id}?`)) return;

  const body = new FormData();
  body.append("CategoryID", id);

  try {
    const res = await fetch(`${API_BASE}/delete_category.php`, {
      method: "POST",
      body
    });

    const data = await res.json();

    if (data.status === "success") {
      fetchCategories();
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
