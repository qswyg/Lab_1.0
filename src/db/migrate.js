const fs = require('fs');
const path = require('path');
const { run, all, db } = require('./dbClient');

async function runMigrations() {
    console.log(" Запуск міграцій...");

    await run(`CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        migration_name TEXT UNIQUE NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
        const alreadyApplied = await get("SELECT id FROM schema_migrations WHERE migration_name = ?", [file]);
        
        if (!alreadyApplied) {
            console.log(`Застосування міграції: ${file}`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
            
          
            const queries = sql.split(';').filter(q => q.trim() !== '');
            for (const query of queries) {
                await run(query);
            }

            await run("INSERT INTO schema_migrations (migration_name) VALUES (?)", [file]);
            console.log(` Міграція ${file} успішно виконана.`);
        }
    }
    console.log(" Всі міграції застосовані.");
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });
}

module.exports = runMigrations;