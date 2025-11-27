const API_ADMIN = "http://localhost/library_backend/admin";

document.addEventListener("DOMContentLoaded", () => {
    loadAdmins();
    setupAdminEvents();
});

async function loadAdmins(){
    const res = await fetch(`${API_ADMIN}/get_admin.php`);
    const admins = await res.json();
    renderAdmins(admins);
}

function renderAdmins(list){
    const tb = document.getElementById("admin-tbody");
    tb.innerHTML = "";

    list.forEach((a,i)=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${a.Name}</td>
            <td>${a.Email}</td>
            <td>${a.Phone}</td>
            <td>
                <button class="action-btn edit" onclick='openEditAdmin(${JSON.stringify(a)})'>Edit</button>
                <button class="action-btn delete" onclick='deleteAdmin(${a.AdminID})'>Delete</button>
            </td>
        `;
        tb.appendChild(tr);
    });
}

function setupAdminEvents(){
    document.getElementById("btn-add-admin").onclick = openAddAdmin;
    document.getElementById("admin-modal-close").onclick = closeAdminModal;
    document.getElementById("admin-cancel").onclick = closeAdminModal;
    document.getElementById("admin-form").onsubmit = saveAdmin;
}

function openAddAdmin(){
    document.getElementById("admin-modal-title").innerText = "Add Admin";
    document.getElementById("admin-form").reset();
    document.getElementById("admin-id").value = "";
    showAdminModal();
}

function openEditAdmin(a){
    document.getElementById("admin-modal-title").innerText = "Edit Admin";
    document.getElementById("admin-id").value = a.AdminID;
    document.getElementById("a-name").value = a.Name;
    document.getElementById("a-email").value = a.Email;
    document.getElementById("a-phone").value = a.Phone;
    showAdminModal();
}

function showAdminModal(){ document.getElementById("admin-modal").style.display = "flex"; }
function closeAdminModal(){ document.getElementById("admin-modal").style.display = "none"; }

async function saveAdmin(e){
    e.preventDefault();

    const id = document.getElementById("admin-id").value;
    const url = id ? `${API_ADMIN}/update_admin.php` : `${API_ADMIN}/create_admin.php`;

    const fd = new FormData(document.getElementById("admin-form"));
    if (id) fd.append("id", id);

    const res = await fetch(url, { method:"POST", body:fd });
    const data = await res.json();

    if (data.status === "success"){
        closeAdminModal();
        loadAdmins();
    }
}

async function deleteAdmin(id){
    if (!confirm("Delete this admin?")) return;

    const fd = new FormData();
    fd.append("id", id);

    const res = await fetch(`${API_ADMIN}/delete_admin.php`, { method:"POST", body:fd });
    const data = await res.json();

    if (data.status === "success") loadAdmins();
}

async function fetchAdmins(q = "") {
    const res = await fetch(`${API_BASE}/get_admin.php?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    renderTable(data);
}

let adminSearchTimer = null;
document.getElementById("search-input").addEventListener("input", () => {
    clearTimeout(adminSearchTimer);
    adminSearchTimer = setTimeout(() => {
        fetchAdmins(document.getElementById("search-input").value.trim());
    }, 300);
});