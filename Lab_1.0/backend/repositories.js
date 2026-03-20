let notes = [
    { id: 1, course: "Програмування", title: "лаба 2", note: "Бекенд" },
    { id: 2, course: "Математичні основи", title: "СРС-4", note: "Завдання №4" }
];

let users = [
    { id: 1, name: "Адмін", email: "admin@example.com" }
];

module.exports = {
    notesGetAll: () => notes,
    notesAdd: (note) => { notes.push(note); return note; },
    notesRemove: (id) => {
        const index = notes.findIndex(n => n.id === id);
        if (index !== -1) return notes.splice(index, 1);
        return null;
    },
    usersGetAll: () => users,
    usersAdd: (user) => { users.push(user); return user; }
};