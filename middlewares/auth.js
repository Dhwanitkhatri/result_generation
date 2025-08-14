const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticate = (req, res, next) => {
    try {
        // Extract token from "Authorization: Bearer <token>"
        const token = req.header('Authorization')?.replace(/Bearer\s+/i, '');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SUPER_SECRET_KEY);
        req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access forbidden. Required role(s): ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
