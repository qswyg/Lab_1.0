const { run, all } = require('../db/dbClient');

module.exports = {
    createCategory: async (name) => {
        const sql = `INSERT INTO Categories (name) VALUES (?)`;
        return await run(sql, [name]);
    },

    getAllCategories: async () => {
        return await all(`SELECT * FROM Categories`);
    }
};