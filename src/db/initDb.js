const { db, run, all } = require('./dbClient');

async function initialize() {
    console.log("📡 [DB LOG]: Початок ініціалізації схеми");
    
    try {
        await run("PRAGMA foreign_keys = ON;");

        await run(`CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);


        await run(`CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            createdAt TEXT NOT NULL
        )`);

        await run(`CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )`);

        await run(`CREATE TABLE IF NOT EXISTS Notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            categoryId INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE CASCADE
        )`);

        await run(`CREATE INDEX IF NOT EXISTS idx_notes_title ON Notes(title)`);

        const categories = await all("SELECT * FROM Categories");
        if (categories.length === 0) {
            console.log(" [DB LOG]: Наповнення початковими даними");
            await run("INSERT INTO Categories (name) VALUES ('ОАП'), ('Архітектура КС'), ('Мат. основи'), ('Програмування')");
            await run("INSERT INTO Users (name, email, createdAt) VALUES ('Ева', 'eva@student.lpnu.ua', ?)", [new Date().toISOString()]);
        }

        console.log(" [DB LOG]: База даних готова до роботи.");
    } catch (err) {
        console.error(" Помилка БД:", err);
    }
}

initialize();