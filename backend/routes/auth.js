const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');


require('dotenv').config();

// Ensure JWT_SECRET is loaded successfully apon the loaded file
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined. Please set it in your .env file.");
}
console.log("JWT_SECRET is loaded:", jwtSecret);

// Middleware to verify JWT Token
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ msg: "Invalid token" });
    }
};

// Middleware to check Admin Role
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Admins only!" });
    }
    next();
};

// guest user registration route
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) return res.status(500).json({ error: "Database error", details: error });

            if (results.length > 0) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            db.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, role],
                (error, results) => {
                    if (error) return res.status(500).json({ error: "Database error", details: error });

                    res.status(201).json({ msg: 'User registered successfully!' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

//any user login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error", details: err });

            if (results.length === 0) {
                return res.status(400).json({ msg: "User not found" });
            }

            const user = results[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid credentials" });
            }

            const token = jwt.sign(
                {
                    userId: user.userID,
                    role: user.role,
                    name: user.username,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({ msg: "Login successful!", token });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Protected Route for User Profile
router.get('/profile', authenticateJWT, (req, res) => {
    res.json({ msg: "You are authorized to access this route", user: req.user });
});

// Protected Route for Admin Bookings
router.get('/admin/bookings', authenticateJWT, verifyAdmin, (req, res) => {
    db.query("SELECT * FROM bookings", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(results);
    });
});

//  Protected Route for User Bookings
router.get('/user/bookings', authenticateJWT, (req, res) => {
    const userId = req.user.userId;

    db.query("SELECT * FROM bookings WHERE userId = ?", [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(results);
    });
});

module.exports = router;

