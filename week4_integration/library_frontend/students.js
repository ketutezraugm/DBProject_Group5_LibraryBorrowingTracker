// students.js
const API_BASE = "http://localhost/library_backend/student";

let allStudents = []; // for search

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  fetchStudents();
});

// ==========================
// INIT UI EVENTS
// ==========================
function initUI() {
  document.getElementById("btn-add-student").addEventListener("click", openAddModal);
  document.getElementById("student-modal-close").addEventListener("click", closeModal);
  document.getElementById("student-modal-cancel").addEventListener("click", closeModal);
  document.getElementById("student-form").addEventListener("submit", onSubmitForm);

  // SEARCH
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", onSearch);
  }
}

// ==========================
// FETCH DATA
// ==========================
async function fetchStudents() {
    const tbody = document.getElementById("students-tbody");
    renderSkeleton(tbody, 8, 6);
  
    try {
      const res = await fetch(`${API_BASE}/get_student.php`);
      allStudents = await res.json();
      renderTable(allStudents);
    } catch (err) {
      console.error(err);
      alert("Failed to load students.");
    }
  }
  

// ==========================
// SEARCH FILTER
// ==========================
function onSearch() {
  const q = searchInput.value.toLowerCase();

  const filtered = allStudents.filter(s =>
    (s.Name || "").toLowerCase().includes(q) ||
    (s.Department || "").toLowerCase().includes(q) ||
    (s.Email || "").toLowerCase().includes(q) ||
    (s.Phone + "").includes(q)
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
function renderTable(students) {
  const tbody = document.getElementById("students-tbody");
  tbody.innerHTML = "";

  if (students.length === 0) {
    showNoResults(tbody, 6);
    return;
  }

  students.forEach((s, idx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(s.Name)}</td>
      <td>${escapeHtml(s.Department)}</td>
      <td>${escapeHtml(s.Email)}</td>
      <td>${escapeHtml(s.Phone)}</td>
      <td>
        <button class="action-btn edit" onclick='openEditModal(${JSON.stringify(s)})'>Edit</button>
        <button class="action-btn delete" onclick="deleteStudent(${s.StudentID})">Delete</button>
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
  document.getElementById("student-modal-title").innerText = "Add Student";
  openModal();
}

function openEditModal(s) {
  if (typeof s === "string") s = JSON.parse(s);

  document.getElementById("student-modal-title").innerText = "Edit Student";

  document.getElementById("student-id").value = s.StudentID;
  document.getElementById("s-name").value = s.Name || "";
  document.getElementById("s-dept").value = s.Department || "";
  document.getElementById("s-email").value = s.Email || "";
  document.getElementById("s-phone").value = s.Phone || "";

  openModal();
}

function openModal() {
  const modal = document.getElementById("student-modal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("student-modal");

  modal.classList.add("closing");
  setTimeout(() => {
    modal.classList.remove("closing");
    modal.style.display = "none";
  }, 200);
}

function clearForm() {
  document.getElementById("student-id").value = "";
  document.getElementById("student-form").reset();
}

// ==========================
// SUBMIT FORM
// ==========================
async function onSubmitForm(e) {
  e.preventDefault();

  const id = document.getElementById("student-id").value;
  const url = id
    ? `${API_BASE}/update_student.php`
    : `${API_BASE}/create_student.php`;

  const formData = new FormData(document.getElementById("student-form"));
  if (id) formData.append("id", id);

  try {
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (data.status === "success") {
      closeModal();
      fetchStudents();
    } else {
      alert("Error: " + (data.message || "unknown"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error.");
  }
}

// ==========================
// DELETE
// ==========================
async function deleteStudent(id) {
  if (!confirm(`Delete student ID ${id}?`)) return;

  const body = new FormData();
  body.append("id", id);

  try {
    const res = await fetch(`${API_BASE}/delete_student.php`, {
      method: "POST",
      body
    });

    const data = await res.json();

    if (data.status === "success") {
      fetchStudents();
    } else {
      alert("Delete failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Network error.");
  }
}

// ==========================
// HTML ESCAPE
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
