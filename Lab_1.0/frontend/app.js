const STORAGE_KEY = "student_notes_var10";
let items = [];
const API_URL = "http://localhost:3000/api";

let filterTerm = "";

const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");

form.addEventListener("submit", handleFormSubmit);
document.getElementById("resetBtn").addEventListener("click", resetForm);

document.addEventListener("DOMContentLoaded", () => {
    loadFromServer();
    
    searchInput.addEventListener("input", (e) => { 
        filterTerm = e.target.value; 
        renderTable(); 
    });  
    
    sortBtn.addEventListener("click", sortItems);

    const userForm = document.getElementById("user-form");
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById("userName").value,
            email: document.getElementById("userEmail").value
        };
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const newUser = await response.json();
                document.getElementById("user-status").innerText = `Вітаємо, ${newUser.name}!`;
                userForm.reset();
            } else {
                alert("Помилка реєстрації");
            }
        } catch (error) {
            console.error("Сервер не працює", error);
        }
    });
});

tbody.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains("delete-btn")) deleteItem(id);
    if (e.target.classList.contains("edit-btn")) startEdit(id);
});

async function loadFromServer() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        const data = await response.json();
        items = data.items || [];
        renderTable();
    } catch (error) {
        console.error("Помилка завантаження:", error);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault(); 
    const id = document.getElementById("edit-id").value;
    const dto = {
        course: document.getElementById("courseSelect").value,
        title: document.getElementById("titleInput").value.trim(),
        note: document.getElementById("noteText").value.trim()
    };

    if (!validate(dto)) return;

    try {
        if (id) {
            // Оновлення (PUT)
            await fetch(`${API_URL}/notes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });
        } else {
            // Створення (POST)
            await fetch(`${API_URL}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });
        }
        loadFromServer();
        resetForm();
    } catch (error) {
        console.error("Помилка збереження:", error);
    }
}

async function deleteItem(id) {
    if (!confirm("Видалити нотатку?")) return;
    try {
        await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
        loadFromServer();
    } catch (error) {
        console.error("Помилка видалення:", error);
    }
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

function sortItems() {
    items.sort((a, b) => a.title.localeCompare(b.title));  
    renderTable();
}

function validate(dto) {
    clearErrors();
    let valid = true;
    if (!dto.course) { showError("courseSelect", "courseError", "Оберіть дисципліну"); valid = false; }
    if (dto.title.length < 3) { showError("titleInput", "titleError", "Мінімум 3 символи"); valid = false; }
    if (dto.note.length < 4) { showError("noteText", "noteError", "Додайте текст до нотатки (мін. 4 символи)"); valid = false; }
    
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

function showError(inputId, errorId, msg) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerText = msg;
}

function clearErrors() {
    ["courseSelect", "titleInput","noteText"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("invalid");
    });
    ["courseError", "titleError","noteError"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = "";
    });
}

const userForm = document.getElementById("user-form");

userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");
    const nameError = document.getElementById("userName-error");
    const emailError = document.getElementById("user-status");

    nameInput.classList.remove("invalid");
    emailInput.classList.remove("invalid");
    document.getElementById("userName-error").innerText = "";
    document.getElementById("userEmail-error").innerText = "";

    const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim()
    };

    let hasError = false;

    if (userData.name.length < 2) {
        nameInput.classList.add("invalid");
        document.getElementById("userName-error").innerText = "Ім'я занадто коротке";
        hasError = true;
    }

    if (!userData.email.includes("@")) {
        emailInput.classList.add("invalid"); 
        document.getElementById("userEmail-error").innerText = "Некоректний Email";
        hasError = true;
    }

    if (hasError) return; 
    try {
        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            document.getElementById("user-status").innerText = "Успішно зареєстровано";
            userForm.reset();
        }
    } catch (err) {
        console.error("Сервер не відповідає", err);
    }
});