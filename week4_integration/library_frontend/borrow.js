// borrow.js
const API_BASE = "http://localhost/library_backend/borrow";

let allBorrow = []; // for search filtering

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  fetchBorrow();
});

// ==========================
// INIT UI
// ==========================
function initUI() {
  document.getElementById("btn-add-borrow").addEventListener("click", openAddModal);
  document.getElementById("borrow-modal-close").addEventListener("click", closeModal);
  document.getElementById("borrow-cancel").addEventListener("click", closeModal);
  document.getElementById("borrow-form").addEventListener("submit", onSubmitForm);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", onSearch);
  }
}

// ==========================
// FETCH BORROW DATA
// ==========================
async function fetchBorrow() {
    const tbody = document.getElementById("borrow-tbody");
    renderSkeleton(tbody, 8, 7);
  
    try {
      const res = await fetch(`${API_BASE}/get_borrow.php`);
      allBorrow = await res.json();
      renderTable(allBorrow);
    } catch (err) {
      console.error(err);
      alert("Failed to load borrow records.");
    }
  }
  

// ==========================
// SEARCH
// ==========================
function onSearch() {
  const q = searchInput.value.toLowerCase();

  const filtered = allBorrow.filter(b =>
    (b.BookID + "").includes(q) ||
    (b.MemberID + "").includes(q) ||
    (b.StudentID + "").includes(q) ||
    (b.BorrowDate || "").toLowerCase().includes(q) ||
    (b.ReturnDate || "").toLowerCase().includes(q) ||
    (b.DueDays + "").includes(q)
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
  const tbody = document.getElementById("borrow-tbody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    showNoResults(tbody, 7);
    return;
  }

  list.forEach((b, idx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(b.BorrowDate)}</td>
      <td>${escapeHtml(b.DueDays)}</td>
      <td>${escapeHtml(b.ReturnDate)}</td>
      <td>${escapeHtml(b.BookID)}</td>
      <td>${escapeHtml(b.StudentID || b.MemberID)}</td>
      <td>
        <button class="action-btn edit" onclick='openEditModal(${JSON.stringify(b)})'>Edit</button>
        <button class="action-btn delete" onclick="deleteBorrow(${b.BorrowID})">Delete</button>
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
  document.getElementById("borrow-modal-title").innerText = "New Borrow";
  openModal();
}

function openEditModal(b) {
  if (typeof b === "string") b = JSON.parse(b);

  document.getElementById("borrow-modal-title").innerText = "Edit Borrow";

  document.getElementById("borrow-id").value = b.BorrowID;
  document.getElementById("b-book").value = b.BookID;
  document.getElementById("b-member").value = b.MemberID || b.StudentID;
  document.getElementById("b-date").value = b.BorrowDate || "";
  document.getElementById("b-due").value = b.DueDays || 14;

  openModal();
}

function openModal() {
  const modal = document.getElementById("borrow-modal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("borrow-modal");

  modal.classList.add("closing");
  setTimeout(() => {
    modal.classList.remove("closing");
    modal.style.display = "none";
  }, 200);
}

function clearForm() {
  document.getElementById("borrow-id").value = "";
  document.getElementById("borrow-form").reset();
}

// ==========================
// SUBMIT FORM
// ==========================
async function onSubmitForm(e) {
  e.preventDefault();

  const id = document.getElementById("borrow-id").value;
  const url = id
    ? `${API_BASE}/update_borrow.php`
    : `${API_BASE}/create_borrow.php`;

  const formData = new FormData(document.getElementById("borrow-form"));
  if (id) formData.append("id", id);

  try {
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (data.status === "success") {
      closeModal();
      fetchBorrow();
    } else {
      alert("Error: " + (data.message || "unknown"));
    }

  } catch (err) {
    console.error(err);
    alert("Network error.");
  }
}

// ==========================
// DELETE BORROW
// ==========================
async function deleteBorrow(id) {
  if (!confirm(`Delete borrow ID ${id}?`)) return;

  const body = new FormData();
  body.append("id", id);

  try {
    const res = await fetch(`${API_BASE}/delete_borrow.php`, {
      method: "POST",
      body
    });

    const data = await res.json();

    if (data.status === "success") {
      fetchBorrow();
    } else {
      alert("Delete failed.");
    }

  } catch (err) {
    console.error(err);
    alert("Network error.");
  }
}

// ==========================
// ESCAPE HTML SAFELY
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
