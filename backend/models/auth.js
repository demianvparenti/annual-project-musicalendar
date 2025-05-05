const db = require('../config/db');

class Auth {
    // Create a new user
    static async create({ username, password, artistId }) {
        const [result] = await db.query(
            'INSERT INTO auth (username, password, artist_id) VALUES (?, ?, ?)',
            [username, password, artistId]
        );
        return result.insertId;
    }

    // Find a user by ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM auth WHERE id = ?', [id]);
        return rows[0];
    }

    // Find a user by username
    static async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM auth WHERE username = ?', [username]);
        return rows[0];
    }

    // Update a user's password
    static async updatePassword(id, newPassword) {
        await db.query('UPDATE auth SET password = ? WHERE id = ?', [newPassword, id]);
    }

    // Delete a user
    static async delete(id) {
        await db.query('DELETE FROM auth WHERE id = ?', [id]);
    }
}

module.exports = Auth;