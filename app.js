const STORAGE_KEY = "student_notes_var10";
let items = loadFromStorage(); 
let filterTerm = "";

const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");

form.addEventListener("submit", handleFormSubmit);
document.getElementById("resetBtn").addEventListener("click", resetForm);
searchInput.addEventListener("input", (e) => { filterTerm = e.target.value; renderTable(); });  
sortBtn.addEventListener("click", sortItems);

tbody.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains("delete-btn")) deleteItem(id);
    if (e.target.classList.contains("edit-btn")) startEdit(id);
});

renderTable();


function handleFormSubmit(e) {
    e.preventDefault(); 
    const dto = {
        id: document.getElementById("edit-id").value,
        course: document.getElementById("courseSelect").value,
        title: document.getElementById("titleInput").value.trim(),
        note: document.getElementById("noteText").value.trim()
    };

    if (!validate(dto)) return;

    if (dto.id) {
        const index = items.findIndex(item => item.id === Number(dto.id));
        items[index] = { ...items[index], ...dto, id: Number(dto.id) };
    } else {
        items.push({ ...dto, id: Date.now() });
    }

    saveToStorage();
    resetForm();
    renderTable();
}

function startEdit(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    document.getElementById("edit-id").value = item.id;
    document.getElementById("courseSelect").value = item.course;
    document.getElementById("titleInput").value = item.title;
    document.getElementById("noteText").value = item.note;
    
    document.getElementById("form-title").innerText = "Редагувати нотатку";
    document.getElementById("submitBtn").innerText = "Оновити";
}

function deleteItem(id) {
    items = items.filter(i => i.id !== id); 
    saveToStorage();
    renderTable();
}

function sortItems() {
    items.sort((a, b) => a.title.localeCompare(b.title));  
    renderTable();
}

function validate(dto) {
    clearErrors();
    let valid = true;
    if (!dto.course) { showError("courseSelect", "courseError", "Оберіть курс"); valid = false; }
    if (dto.title.length < 3) { showError("titleInput", "titleError", "Мінімум 3 символи"); valid = false; }
    return valid;
}

function renderTable() {
    const filtered = items.filter(i => i.title.toLowerCase().includes(filterTerm.toLowerCase()));
    
    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td>${item.course}</td>
            <td>${item.title}</td>
            <td>${item.note}</td>
            <td>
                <button class="edit-btn" data-id="${item.id}">Ред.</button>
                <button class="delete-btn" data-id="${item.id}">Вид.</button>
            </td>
        </tr>
    `).join("");
}

function resetForm() {
    form.reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("form-title").innerText = "Додати нотатку";
    document.getElementById("submitBtn").innerText = "Зберегти";
    clearErrors();
}

function saveToStorage() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function loadFromStorage() { 
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : []; 
}

function showError(inputId, errorId, msg) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerText = msg;
}

function clearErrors() {
    ["courseSelect", "titleInput"].forEach(id => document.getElementById(id).classList.remove("invalid"));
    ["courseError", "titleError"].forEach(id => document.getElementById(id).innerText = "");
}