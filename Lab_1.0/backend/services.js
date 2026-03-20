const Repo = require("./repositories");

module.exports = {
    getAll: () => Repo.notesGetAll(),
    
    create: (dto) => {
        const details = [];
        if (!dto.course) details.push("Поле 'course' обов'язкове");
        if (!dto.title || dto.title.length < 3) details.push("Заголовок має бути мінімум 3 символи");
        if (!dto.note || dto.note.length < 4) details.push("Зміст нотатки занадто короткий");

        if (details.length > 0) {
            const error = new Error("Invalid request body");
            error.code = "VALIDATION_ERROR";
            error.details = details;
            throw error; 
        }

        const newNote = { id: Date.now(), ...dto };
        return Repo.notesAdd(newNote);
    },

    getAllUsers: () => Repo.usersGetAll(),
    
    registerUser: (userData) => {
        const details = [];
        if (!userData.name || userData.name.length < 2) details.push("Ім'я занадто коротке");
        if (!userData.email || !userData.email.includes("@")) details.push("Некоректний email");

        if (details.length > 0) {
            const error = new Error("User validation failed");
            error.code = "VALIDATION_ERROR";
            error.details = details;
            throw error;
        }

        const newUser = { id: Date.now(), ...userData };
        return Repo.usersAdd(newUser);
    },

    delete: (id) => {
        const deleted = Repo.notesRemove(Number(id));
        if (!deleted) {
            const error = new Error("Not Found");
            error.code = "NOT_FOUND";
            throw error;
        }
        return deleted;
    },
      getById: (id) => {
        const item = Repo.notesGetAll().find(n => n.id === Number(id));
        if (!item) {
            const error = new Error("Note with this ID not found");
            error.code = "NOT_FOUND";
            throw error;
        }
        return item;
    },
    
};

