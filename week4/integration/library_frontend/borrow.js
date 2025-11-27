// borrow.js
const API_BORROW = "http://localhost/library_backend/borrow";

document.addEventListener("DOMContentLoaded", () => {
  initBorrow();
  fetchBorrow();
});

function initBorrow(){
  document.getElementById("btn-add-borrow").addEventListener("click",openBorrowModal);
  document.getElementById("borrow-modal-close").addEventListener("click",closeBorrowModal);
  document.getElementById("borrow-cancel").addEventListener("click",closeBorrowModal);
  document.getElementById("borrow-form").addEventListener("submit",onBorrowSubmit);
}

async function fetchBorrows(q = "") {
    const res = await fetch(`${API_BASE}/get_borrow.php?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    renderTable(data);
}

let borrowSearchTimer = null;
document.getElementById("search-input").addEventListener("input", () => {
    clearTimeout(borrowSearchTimer);
    borrowSearchTimer = setTimeout(() => {
        fetchBorrows(document.getElementById("search-input").value.trim());
    }, 300);
});


function renderBorrowTable(list){
  const tbody = document.getElementById("borrow-tbody");
  tbody.innerHTML = "";
  list.forEach((b, idx)=>{
    const tr = document.createElement("tr");
    const rd = b.ReturnDate ? b.ReturnDate : "";
    tr.innerHTML = `<td>${idx+1}</td>
      <td>${b.BorrowDate}</td>
      <td>${b.ReturnDueDate}</td>
      <td>${rd}</td>
      <td>${escapeHtml(b.Title || '')}</td>
      <td>${escapeHtml(b.StudentName || '')}</td>
      <td>
        ${!b.ReturnDate ? `<button class="action-btn edit" onclick='markReturn(${b.BorrowID})'>Return</button>` : ''}
        <button class="action-btn delete" onclick="deleteBorrow(${b.BorrowID})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function openBorrowModal(){
  document.getElementById("borrow-form").reset();
  document.getElementById("borrow-modal-title").innerText = "New Borrow";
  document.getElementById("borrow-modal").style.display = "flex";
}

function closeBorrowModal(){ document.getElementById("borrow-modal").style.display = "none"; }

async function onBorrowSubmit(e){
  e.preventDefault();
  const form = document.getElementById("borrow-form");
  const fd = new FormData(form);
  try{
    const res = await fetch(`${API_BORROW}/create_borrow.php`, { method: 'POST', body: fd });
    const data = await res.json();
    if (data.status === "success") { closeBorrowModal(); fetchBorrow(); }
    else alert("Error: "+(data.message||"unknown"));
  } catch(err){ console.error(err); alert("Network error"); }
}

async function markReturn(id){
  const date = prompt("Enter return date (YYYY-MM-DD) or leave blank for today:");
  if (date === null) return;
  const rd = date.trim() || new Date().toISOString().slice(0,10);
  const fd = new FormData();
  fd.append("id", id);
  fd.append("returnDate", rd);
  try{
    const res = await fetch(`${API_BORROW}/update_borrow.php`, { method:'POST', body: fd });
    const data = await res.json();
    if (data.status === "success") fetchBorrow();
    else alert("Error: "+(data.message||"unknown"));
  } catch(e){ console.error(e); alert("Network error"); }
}

async function deleteBorrow(id){
  if (!confirm("Delete borrow record "+id+"?")) return;
  const fd = new FormData(); fd.append("id", id);
  try{
    const res = await fetch(`${API_BORROW}/delete_borrow.php`, { method:'POST', body:fd });
    const data = await res.json();
    if (data.status==="success") fetchBorrow(); else alert("Delete failed");
  } catch(e){ console.error(e); alert("Network error"); }
}

function escapeHtml(str){ if (str==null) return ''; return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
