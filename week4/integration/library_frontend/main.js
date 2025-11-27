// =====================
// FETCH STUDENTS
// =====================
async function fetchStudents() {
    try {
        const response = await fetch("http://localhost/library_backend/student/get_students.php");
        const data = await response.json();

        const table = document.getElementById("studentTableBody");
        table.innerHTML = "";

        data.forEach(student => {
            table.innerHTML += `
                <tr>
                    <td>${student.student_id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}



// =====================
// FETCH BORROW
// =====================
async function fetchBorrow() {
    try {
        const response = await fetch("http://localhost/library_backend/borrow/get_borrow.php");
        const data = await response.json();

        const table = document.getElementById("borrowTableBody");
        table.innerHTML = "";

        data.forEach(entry => {
            table.innerHTML += `
                <tr>
                    <td>${entry.borrow_id}</td>
                    <td>${entry.student_name}</td>
                    <td>${entry.book_title}</td>
                    <td>${entry.borrow_date}</td>
                    <td>${entry.return_date}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching borrow records:", error);
    }
}