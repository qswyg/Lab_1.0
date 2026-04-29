const { run, all, get } = require('../db/dbClient');

module.exports = {

    getAllNotes: async (query = {}) => {
        let sql = `
            SELECT Notes.*, Categories.name as categoryName 
            FROM Notes 
            JOIN Categories ON Notes.categoryId = Categories.id
            WHERE 1=1
        `;
        const params = [];

        if (query.categoryId) {
            sql += " AND Notes.categoryId = ?";
            params.push(query.categoryId);
        }

        sql += " ORDER BY Notes.createdAt DESC LIMIT 50";
        return await all(sql, params);
    },


    countNotesByCategory: async () => {
        const sql = `
            SELECT Categories.name, COUNT(Notes.id) as count
            FROM Categories
            LEFT JOIN Notes ON Categories.id = Notes.categoryId
            GROUP BY Categories.id
        `;
        return await all(sql);
    },

    getNoteById: async (id) => {
        return await get("SELECT * FROM Notes WHERE id = ?", [id]);
    },

    createNote: async (note) => {
        const { userId, categoryId, title, content, createdAt } = note;
        const sql = `INSERT INTO Notes (userId, categoryId, title, content, createdAt) VALUES (?, ?, ?, ?, ?)`;
        return await run(sql, [userId, categoryId, title, content, createdAt]);
    },

    updateNote: async (id, note) => {
        const { title, content } = note;
        const sql = `UPDATE Notes SET title = ?, content = ? WHERE id = ?`;
        return await run(sql, [title, content, id]);
    },

    deleteNote: async (id) => {
        return await run("DELETE FROM Notes WHERE id = ?", [id]);
    },

    
    searchNotesVulnerable: async (searchTerm) => {

        const sql = "SELECT * FROM Notes WHERE title LIKE '%" + searchTerm + "%'";
        return await all(sql);
    }
};