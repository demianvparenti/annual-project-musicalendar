const db = require('../config/db');

class Artist {
    static async create({ name, email, genre, photo, links }) {
        const [result] = await db.query(
            'INSERT INTO artists (name, email, genre, photo, links) VALUES (?, ?, ?, ?, ?)',
            [name, email, genre, photo, JSON.stringify(links)]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM artists WHERE id = ?', [id]);
        if (rows[0] && rows[0].links) {
            rows[0].links = JSON.parse(rows[0].links); // Parse the JSON string into an object/array
        }
        return rows[0];
    }

    static async update(id, { name, email, genre, photo, links }) {
        await db.query(
            'UPDATE artists SET name = ?, email = ?, genre = ?, photo = ?, links = ? WHERE id = ?',
            [name, email, genre, photo, JSON.stringify(links), id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM artists WHERE id = ?', [id]);
    }
}

module.exports = Artist;