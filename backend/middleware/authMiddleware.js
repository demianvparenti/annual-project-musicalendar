const jwt = require('jsonwebtoken');

// Middleware to authenticate token and check roles
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader); // Debugging: Log the Authorization header

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Session expired. Please log in again.' });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Middleware to check for specific roles
exports.authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log('User Role:', req.user?.role); // Debugging: Log the user's role

        if (!req.user || !allowedRoles.includes(req.user.role)) {
            console.error(
                `Access denied: Required roles are ${allowedRoles.join(', ')}, but user role is ${req.user?.role}`
            ); // Debugging: Log role mismatch
            return res.status(403).json({
                error: `Access denied, one of the following roles required: ${allowedRoles.join(', ')}`,
            });
        }
        next(); // Proceed if the role matches
    };
};