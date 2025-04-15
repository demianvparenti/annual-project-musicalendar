const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getAuth = async (req, res) => {
    try {
    const [rows] = await db.query('SELECT id, username, password FROM auth'); // Updated table name to "users"
    res.json(rows);
    } catch (err) {
    console.error('Error fetching users:', err); // Updated error message
    res.status(500).json({ error: 'Internal server error' }); // Updated response message
    }
}

const bcrypt = require('bcrypt');

exports.createAuth = async (req, res) => {
    const { username, password, artist_id } = req.body;

    if (!username || !password || !artist_id) {
        return res.status(400).json({ error: 'Username, password, and artist_id are required' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM auth WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const [artist] = await db.query('SELECT * FROM artists WHERE id = ?', [artist_id]);
        if (artist.length === 0) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO auth (username, password, artist_id) VALUES (?, ?, ?)',
            [username, hashedPassword, artist_id]
        );

        res.status(201).json({
            id: result.insertId,
            username,
            artist_id
        });
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error creating user:', err);
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const [user] = await db.query('SELECT * FROM auth WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user[0].id, username: user[0].username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error logging in:', err);
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};