const Auth = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.createUser = async (req, res) => {
    const { username, password, name, email } = req.body;

    try {
        // Step 1: Create the artist
        const [artistResult] = await db.query(
            'INSERT INTO artists (name, email) VALUES (?, ?)',
            [name, email]
        );

        const artistId = artistResult.insertId; // Get the newly created artist's ID

        // Step 2: Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 3: Create the auth record
        await db.query(
            'INSERT INTO auth (username, password, artist_id) VALUES (?, ?, ?)',
            [username, hashedPassword, artistId]
        );

        res.status(201).json({ message: 'User registered successfully', artistId });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await Auth.findByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Fetch the artistId from the database
        const [artistResult] = await db.query(
            'SELECT artist_id FROM auth WHERE id = ?',
            [user.id]
        );
        const artistId = artistResult[0]?.artist_id || null; // Get the artistId (if it exists)

        // Generate a JWT token with the user's role and artistId
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, artistId }, // Include artistId
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, username: user.username, role: user.role });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID
        const user = await Auth.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await Auth.updatePassword(id, hashedPassword);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the user
        await Auth.delete(id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};