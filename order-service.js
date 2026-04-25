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

// Middleware
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
app.get('/orders', authenticate, (req, res) => {
    res.json([
        { id: 101, item: "Laptop", price: 50000 }
    ]);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Auth running on ${PORT}`);
});
