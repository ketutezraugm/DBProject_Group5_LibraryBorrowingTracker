const API_BOOKS = "http://localhost/library_backend/book/get_books.php";
const API_BORROW = "http://localhost/library_backend/borrow/create_borrow.php";

document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    document.getElementById("searchInput").addEventListener("input", filterBooks);
});

let booksData = [];

function loadBooks() {
    fetch(API_BOOKS)
        .then(res => res.json())
        .then(data => {
            booksData = data;
            displayBooks(data);
        })
        .catch(err => console.error("Error loading books:", err));
}

function displayBooks(list) {
    const grid = document.getElementById("booksGrid");
    grid.innerHTML = "";

    list.forEach(book => {
        grid.innerHTML += `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Category:</strong> ${book.category}</p>
                <p><strong>Status:</strong> ${book.status}</p>

                <button class="borrow-btn" onclick="requestBorrow('${book.book_id}')">
                    Request Borrow
                </button>
            </div>
        `;
    });
}

function filterBooks() {
    const q = document.getElementById("searchInput").value.toLowerCase();
    const filtered = booksData.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
    displayBooks(filtered);
}

function requestBorrow(bookId) {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("You must login first!");
        window.location.href = "../auth/login.html";
        return;
    }

    let form = new FormData();
    form.append("student_id", userId);
    form.append("book_id", bookId);

    fetch(API_BORROW, { method: "POST", body: form })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
        })
        .catch(err => console.error("Borrow error:", err));
}
