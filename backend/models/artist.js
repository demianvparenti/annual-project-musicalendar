const db = require('../config/db');

class Artist {
    static async create({ name, email, genre, photo, website, instagram, youtube }) {
        const [result] = await db.query(
            'INSERT INTO artists (name, email, genre, photo, website_link, instagram_link, youtube_link) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, genre, photo, website, instagram, youtube]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM artists WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, { name, email, genre, photo, website, instagram, youtube }) {
        await db.query(
            'UPDATE artists SET name = ?, email = ?, genre = ?, photo = ?, website_link = ?, instagram_link = ?, youtube_link = ? WHERE id = ?',
            [name, email, genre, photo, website, instagram, youtube, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM artists WHERE id = ?', [id]);
    }
}

module.exports = Artist;