const { run, all, get } = require('../db/dbClient');

module.exports = {
    createUser: async (user) => {
        const { email, name, createdAt } = user;
        const sql = `INSERT INTO Users (email, name, createdAt) VALUES (?, ?, ?)`;
        return await run(sql, [email, name, createdAt]);
    },

    getAllUsers: async () => {
        return await all(`SELECT * FROM Users`);
    },

    getUserByEmail: async (email) => {
        return await get(`SELECT * FROM Users WHERE email = ?`, [email]);
    }
};