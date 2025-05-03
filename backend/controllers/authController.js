const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getAuth = async (req, res) => {
    try {
    const [rows] = await db.query('SELECT id, username, password FROM auth'); // Updated table name to "users"
    res.json(rows);
    } catch (err) {
    console.error('Error fetching users:', err); // Updated error message
    res.status(500).json({ error: 'Internal server error' }); // Updated response message
    }
}

exports.createAuth = async (req, res) => {
    const { username, password, name, email } = req.body; // Include 'email' here

    if (!username || !password || !name || !email) {
        return res.status(400).json({ error: 'Username, password, name, and email are required' });
    }

    const connection = await db.getConnection(); // Use a transaction for atomicity

    try {
        await connection.beginTransaction();

        // Check if the username already exists
        const [existingUser] = await connection.query('SELECT * FROM auth WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Insert a new artist into the artist table
        const [artistResult] = await connection.query('INSERT INTO artists (name, email) VALUES (?, ?)', [name, email]);
        const artistId = artistResult.insertId;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the auth table
        const [authResult] = await connection.query(
            'INSERT INTO auth (username, password, artist_id) VALUES (?, ?, ?)',
            [username, hashedPassword, artistId]
        );

        await connection.commit();

        // Respond with the created user's ID and username
        res.status(201).json({
            id: authResult.insertId,
            username,
            artist_id: artistId
        });
    } catch (err) {
        await connection.rollback();
        if (process.env.NODE_ENV === 'development') {
            console.error('Error creating user:', err);
        }
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};

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