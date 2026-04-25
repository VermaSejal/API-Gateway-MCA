require('dotenv').config({ path: 'config.env' });
const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

const SECRET = process.env.JWT_SECRET || "mysecretkey";

// Middleware to verify token
function authenticate(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: "Token required" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// Protected API
app.get('/users', authenticate, (req, res) => {
    res.json([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
    ]);
});

app.listen(3001, () => console.log("User Service running on port 3001"));