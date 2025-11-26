// students.js
const API_STUDENT = "http://localhost/library_backend/student";

document.addEventListener("DOMContentLoaded", () => {
  initStudentUI();
  fetchStudents();
});

function initStudentUI(){
  document.getElementById("btn-add-student").addEventListener("click", () => openAddStudentModal());
  document.getElementById("student-modal-close").addEventListener("click", closeStudentModal);
  document.getElementById("student-modal-cancel").addEventListener("click", closeStudentModal);
  document.getElementById("student-form").addEventListener("submit", onStudentFormSubmit);
}

async function fetchStudents(){
  try {
    const res = await fetch(`${API_STUDENT}/get_student.php`);
    const students = await res.json();
    renderStudentTable(students);
  } catch (err) {
    console.error("Failed to fetch students", err);
    alert("Failed to load students. Check backend.");
  }
}

function renderStudentTable(students){
  const tbody = document.getElementById("students-tbody");
  tbody.innerHTML = "";
  students.forEach((s, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${escapeHtml(s.Name)}</td>
      <td>${escapeHtml(s.Department)}</td>
      <td>${escapeHtml(s.Email)}</td>
      <td>${escapeHtml(s.Phone)}</td>
      <td>
        <button class="action-btn edit" onclick='openEditStudent(${JSON.stringify(s)})'>Edit</button>
        <button class="action-btn delete" onclick="deleteStudent(${s.MemberID})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddStudentModal(){
  clearStudentForm();
  document.getElementById("student-modal-title").innerText = "Add Student";
  showStudentModal();
}

function openEditStudent(student){
  if (typeof student === "string") student = JSON.parse(student);
  document.getElementById("student-modal-title").innerText = "Edit Student";
  document.getElementById("student-id").value = student.MemberID;
  document.getElementById("s-name").value = student.Name || "";
  document.getElementById("s-dept").value = student.Department || "";
  document.getElementById("s-email").value = student.Email || "";
  document.getElementById("s-phone").value = student.Phone || "";
  showStudentModal();
}

function showStudentModal(){
  document.getElementById("student-modal").style.display = "flex";
}
function closeStudentModal(){
  document.getElementById("student-modal").style.display = "none";
}
function clearStudentForm(){
  document.getElementById("student-id").value = "";
  document.getElementById("student-form").reset();
}

async function onStudentFormSubmit(e){
  e.preventDefault();
  const id = document.getElementById("student-id").value;
  const url = id ? `${API_STUDENT}/update_student.php` : `${API_STUDENT}/create_student.php`;

  const formEl = document.getElementById("student-form");
  const formData = new FormData(formEl);
  if (id) formData.append("id", id);

  try {
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();
    if (data.status === "success") {
      closeStudentModal();
      await fetchStudents();
    } else {
      alert("Error: " + (data.message || "unknown"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Check backend.");
  }
}

async function deleteStudent(id){
  if (!confirm("Delete student ID " + id + "?")) return;
  try {
    const body = new FormData();
    body.append("id", id);
    const res = await fetch(`${API_STUDENT}/delete_student.php`, {
      method: "POST",
      body
    });
    const data = await res.json();
    if (data.status === "success") {
      fetchStudents();
    } else {
      alert("Delete failed: " + (data.message || "unknown"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error on delete.");
  }
}

// reuse escape helper from books.js (paste into a shared util.js if you want)
function escapeHtml(str){
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
