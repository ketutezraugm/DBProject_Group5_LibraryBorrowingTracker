// books.js
const API_BASE = "http://localhost/library_backend/book";

let allBooks = []; // for search

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  fetchBooks();
});

// ==========================
// INIT UI EVENTS
// ==========================
function initUI() {
  document.getElementById("btn-add").addEventListener("click", () => openAddModal());
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document.getElementById("book-form").addEventListener("submit", onSubmitForm);

  // SEARCH
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", onSearch);
  }
}

// ==========================
// FETCH DATA
// ==========================
async function fetchBooks() {
    const tbody = document.getElementById("books-tbody");
    renderSkeleton(tbody, 8, 9); // 8 rows, 9 columns
  
    try {
      const res = await fetch(`${API_BASE}/get_books.php`);
      allBooks = await res.json();
      renderTable(allBooks);
    } catch (err) {
      console.error(err);
      alert("Failed to load books.");
    }
  }
  

// ==========================
// SEARCH
// ==========================
function onSearch() {
  const q = searchInput.value.toLowerCase();

  const filtered = allBooks.filter(b =>
    (b.Title || "").toLowerCase().includes(q) ||
    (b.Author || "").toLowerCase().includes(q) ||
    (b.ISBN || "").toLowerCase().includes(q) ||
    (b.Status || "").toLowerCase().includes(q) ||
    (b.CategoryID + "").includes(q) ||
    (b.AdminID + "").includes(q)
  );

  renderTable(filtered);
}

// ==========================
// NO RESULTS HELPER
// ==========================
function showNoResults(tbody, colSpan) {
  tbody.innerHTML = `
    <tr>
      <td class="no-results" colspan="${colSpan}">
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
function renderTable(books) {
  const tbody = document.getElementById("books-tbody");
  tbody.innerHTML = "";

  // show "no results" message
  if (books.length === 0) {
    showNoResults(tbody, 9);
    return;
  }

  books.forEach((b, idx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(b.Title)}</td>
      <td>${escapeHtml(b.Author)}</td>
      <td>${escapeHtml(b.ISBN)}</td>
      <td>${escapeHtml(b.PublicationYear || "")}</td>
      <td>${escapeHtml(b.CategoryID || "")}</td>
      <td>${escapeHtml(b.AdminID || "")}</td>
      <td>${escapeHtml(b.Status || "")}</td>
      <td>
        <button class="action-btn edit" onclick='openEditModal(${JSON.stringify(b)})'>Edit</button>
        <button class="action-btn delete" onclick="deleteBook(${b.BookID})">Delete</button>
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
  document.getElementById("modal-title").innerText = "Add Book";
  openModal();
}

function openEditModal(book) {
  if (typeof book === "string") book = JSON.parse(book);

  document.getElementById("modal-title").innerText = "Edit Book";

  document.getElementById("book-id").value = book.BookID;
  document.getElementById("title").value = book.Title || "";
  document.getElementById("author").value = book.Author || "";
  document.getElementById("isbn").value = book.ISBN || "";
  document.getElementById("year").value = book.PublicationYear || "";
  document.getElementById("admin").value = book.AdminID || "";
  document.getElementById("category").value = book.CategoryID || "";
  document.getElementById("status").value = book.Status || "available";

  openModal();
}

function openModal() {
  const modal = document.getElementById("book-modal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("book-modal");

  modal.classList.add("closing");
  setTimeout(() => {
    modal.classList.remove("closing");
    modal.style.display = "none";
  }, 200);
}

function clearForm() {
  document.getElementById("book-id").value = "";
  document.getElementById("book-form").reset();
}

// ==========================
// SUBMIT FORM
// ==========================
async function onSubmitForm(e) {
  e.preventDefault();

  const id = document.getElementById("book-id").value;
  const url = id
    ? `${API_BASE}/update_book.php`
    : `${API_BASE}/create_book.php`;

  const formData = new FormData(document.getElementById("book-form"));

  if (id) formData.append("id", id);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.status === "success") {
      closeModal();
      fetchBooks();
    } else {
      alert("Error: " + (data.message || "unknown"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Check backend.");
  }
}

// ==========================
// DELETE BOOK
// ==========================
async function deleteBook(id) {
  if (!confirm(`Delete book ID ${id}?`)) return;

  const body = new FormData();
  body.append("id", id);

  try {
    const res = await fetch(`${API_BASE}/delete_book.php`, {
      method: "POST",
      body
    });

    const data = await res.json();

    if (data.status === "success") {
      fetchBooks();
    } else {
      alert("Delete failed: " + (data.message || "unknown"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error on delete.");
  }
}

// ==========================
// XSS SAFE TEXT
// ==========================
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
