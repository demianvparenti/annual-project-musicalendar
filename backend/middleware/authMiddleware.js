const jwt = require('jsonwebtoken');

// Middleware to authenticate token and check roles
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader); // Debugging: Log the Authorization header

    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    console.log('Extracted Token:', token); // Debugging: Log the extracted token

    if (!token) {
        console.error('Access denied: Token missing'); // Debugging: Log missing token
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log('Decoded Token:', decoded); // Debugging: Log the decoded token

        req.user = decoded; // Attach the decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Invalid token:', err); // Debugging: Log token verification error
        res.status(403).json({ error: 'Invalid token' });
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