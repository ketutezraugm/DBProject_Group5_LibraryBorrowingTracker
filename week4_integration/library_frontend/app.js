// app.js - quick dashboard counts (calls backend)

async function loadCounts(){
  try {
    const books = await fetch('http://localhost/library_backend/book/get_books.php').then(r=>r.json());
    const students = await fetch('http://localhost/library_backend/student/get_student.php').then(r=>r.json());
    const borrows = await fetch('http://localhost/library_backend/borrow/get_borrow.php').then(r=>r.json());
    const admins = await fetch('http://localhost/library_backend/admin/get_admin.php').then(r=>r.json());

    document.getElementById('totalBooks').innerText = Array.isArray(books)?books.length:0;
    document.getElementById('totalStudents').innerText = Array.isArray(students)?students.length:0;
    // currently borrowed = borrows where ReturnDate is null
    document.getElementById('totalBorrow').innerText = Array.isArray(borrows)? borrows.filter(b=>!b.ReturnDate).length : 0;
    document.getElementById('totalAdmins').innerText = Array.isArray(admins)?admins.length:0;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadCounts);
