// app.js
async function loadCounts(){
  try {
    const books = await fetch('http://localhost/library_backend/book/get_books.php').then(r=>r.json());
    const students = await fetch('http://localhost/library_backend/student/get_student.php').then(r=>r.json());
    const borrows = await fetch('http://localhost/library_backend/borrow/get_borrow.php').then(r=>r.json());
    const admins = await fetch('http://localhost/library_backend/admin/get_admin.php').then(r=>r.json());

    document.getElementById('totalBooks').innerText = books.length;
    document.getElementById('totalStudents').innerText = students.length;
    document.getElementById('totalBorrow').innerText = borrows.filter(b=>!b.ReturnDate).length;
    document.getElementById('totalAdmins').innerText = admins.length;

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadCounts);
