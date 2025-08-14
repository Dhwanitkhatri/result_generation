const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();
 
// login routhe 
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ Message: "username and password required" });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ Message: "invalid user" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ Message: "invalid user or password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.SUPER_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            Message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({ Message: 'server error', error: error.message });
    }
});


module.exports = router;
