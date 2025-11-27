const API_CAT = "http://localhost/library_backend/category";

document.addEventListener("DOMContentLoaded", () => {
    loadCategory();
    setupCategoryEvents();
});

async function loadCategory(){
    const res = await fetch(`${API_CAT}/get_category.php`);
    const list = await res.json();
    renderCategory(list);
}

function renderCategory(list){
    const tb = document.getElementById("category-tbody");
    tb.innerHTML = "";

    list.forEach((c,i)=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${c.CategoryName}</td>
            <td>
                <button class="action-btn delete" onclick='deleteCategory(${c.CategoryID})'>Delete</button>
            </td>
        `;
        tb.appendChild(tr);
    });
}

function setupCategoryEvents(){
    document.getElementById("btn-add-category").onclick = openCategoryModal;
    document.getElementById("category-modal-close").onclick = closeCategoryModal;
    document.getElementById("category-cancel").onclick = closeCategoryModal;
    document.getElementById("category-form").onsubmit = saveCategory;
}

function openCategoryModal(){
    document.getElementById("category-form").reset();
    document.getElementById("category-modal").style.display = "flex";
}

function closeCategoryModal(){
    document.getElementById("category-modal").style.display = "none";
}

async function saveCategory(e){
    e.preventDefault();

    const fd = new FormData(document.getElementById("category-form"));
    const res = await fetch(`${API_CAT}/create_category.php`, { method:"POST", body: fd });
    const data = await res.json();

    if (data.status === "success"){
        closeCategoryModal();
        loadCategory();
    }
}

async function deleteCategory(id){
    if (!confirm("Delete this category?")) return;
    
    const fd = new FormData();
    fd.append("id", id);

    const res = await fetch(`${API_CAT}/delete_category.php`, { method:"POST", body: fd });
    const data = await res.json();

    if (data.status === "success") loadCategory();
}

async function fetchCategories(q = "") {
    const res = await fetch(`${API_BASE}/get_category.php?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    renderTable(data);
}

let categorySearchTimer = null;
document.getElementById("search-input").addEventListener("input", () => {
    clearTimeout(categorySearchTimer);
    categorySearchTimer = setTimeout(() => {
        fetchCategories(document.getElementById("search-input").value.trim());
    }, 300);
});