const bettersqlite3 = require('better-sqlite3');
const db = new bettersqlite3('database.sqlite');

module.exports = class Database {
    static hasTable(table) {
        return db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name=${sanitizeKeyName(table)};`)
            .then(Boolean);
    }

    static createTable(table, rows) {
        db.prepare(`CREATE TABLE ${table} (${rows.map((k) => `${k}`).join(', ')});`).run();
        db.prepare(`CREATE UNIQUE INDEX idx_${table}_id on ${table} (id);`).run();
        db.pragma("synchronous = 1");
        db.pragma("journal_mode = wal");
        return true;
    }

    static deleteTable(table) {
        return db.prepare(`DROP TABLE ${table};`);
    }

    static async getAll(table) {
        let output = await db.prepare(`SELECT * FROM ${table};`).all();
        return output;
    }

    static check(table, rows) {
        const checker = db.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name=${sanitizeKeyName(table)};`).get();

        if(!checker['count(*)']) {
            db.prepare(`CREATE TABLE ${table} (${rows.map((k) => `${k}`).join(', ')});`).run();
            db.prepare(`CREATE UNIQUE INDEX idx_${table}_id on ${table} (id);`).run();
            db.pragma("synchronous = 1");
            db.pragma("journal_mode = wal");

            return true;
        }

        return true;
    }

    static getOne(table) {
        return db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
    }

    static set(table, rows) {
        return db.prepare(`INSERT OR REPLACE INTO ${table} (${rows.map((k) => `${k}`).join(', ')}) VALUES (${rows.map((k) => `@${k}`).join(', ')})`);
    }

    static has(table, id) {
        return db.prepare(`SELECT id FROM ${table} WHERE id = ?;`).get(id)
            .then(() => true)
            .catch(() => false);
    }

    static getRandom(table) {
        return db.prepare(`SELECT * FROM ${table} ORDER BY RANDOM() LIMIT 1;`).all();
    }
};

function sanitizeKeyName(value) {
	if (typeof value !== 'string') throw new TypeError(`[SANITIZE_NAME] Expected a string, got: ${new Type(value)}`);
	if (/`|"/.test(value)) throw new TypeError(`Invalid input (${value}).`);
	if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') return value;
	return `"${value}"`;
}