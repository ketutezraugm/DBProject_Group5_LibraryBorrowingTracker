// books.js
const API_BASE = "http://localhost/library_backend/book";

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  fetchBooks();
});


function initUI(){
  document.getElementById("btn-add").addEventListener("click", () => openAddModal());
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document.getElementById("book-form").addEventListener("submit", onSubmitForm);
}

async function fetchBooks(){
  try {
    const res = await fetch(`${API_BASE}/get_books.php`);
    const books = await res.json();
    renderTable(books);
  } catch (err) {
    console.error("Failed to fetch books", err);
    alert("Failed to load books. Check backend.");
  }
}

function renderTable(books){
  const tbody = document.getElementById("books-tbody");
  tbody.innerHTML = "";
  books.forEach((b, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx+1}</td>
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

function openAddModal(){
  clearForm();
  document.getElementById("modal-title").innerText = "Add Book";
  showModal();
}

function openEditModal(book){
  // book may be passed as object stringified by renderTable -> JSON.parse will be automatic for onclick?
  // The renderTable sends JSON.stringify(b) so here book is an object. If not, parse.
  if (typeof book === "string") {
    book = JSON.parse(book);
  }
  document.getElementById("modal-title").innerText = "Edit Book";
  document.getElementById("book-id").value = book.BookID;
  document.getElementById("title").value = book.Title || "";
  document.getElementById("author").value = book.Author || "";
  document.getElementById("isbn").value = book.ISBN || "";
  document.getElementById("year").value = book.PublicationYear || "";
  document.getElementById("admin").value = book.AdminID || "";
  document.getElementById("category").value = book.CategoryID || "";
  document.getElementById("status").value = book.Status || "available";
  showModal();
}

function showModal(){
  document.getElementById("book-modal").style.display = "flex";
}

function closeModal(){
  document.getElementById("book-modal").style.display = "none";
}

function clearForm(){
  document.getElementById("book-id").value = "";
  document.getElementById("book-form").reset();
}

// submit handler: decides create or update
async function onSubmitForm(e){
  e.preventDefault();
  const id = document.getElementById("book-id").value;
  const url = id ? `${API_BASE}/update_book.php` : `${API_BASE}/create_book.php`;

  const formEl = document.getElementById("book-form");
  const formData = new FormData(formEl);

  // if update, include id
  if (id) formData.append("id", id);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.status === "success") {
      closeModal();
      await fetchBooks();
    } else {
      alert("Error: " + (data.message || "unknown"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Check backend.");
  }
}

// delete
async function deleteBook(id){
  if (!confirm("Delete book ID " + id + "? This will remove the record.")) return;
  try {
    const body = new FormData();
    body.append("id", id);
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

// small helper to avoid XSS in table
function escapeHtml(str){
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// --- SEARCH LOGIC ---
let searchTimer = null;

document.getElementById("search-input").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const q = document.getElementById("search-input").value.trim();
        fetchBooks(q);
    }, 300); // debounce
});

// --- UPDATED fetchBooks ---
async function fetchBooks(search = "") {
    try {
        const res = await fetch(`${API_BASE}/get_books.php?q=${encodeURIComponent(search)}`);
        const books = await res.json();
        renderTable(books);
    } catch (err) {
        console.error("Failed to fetch books", err);
        alert("Error loading books.");
    }
}