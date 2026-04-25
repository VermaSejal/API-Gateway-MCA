require('dotenv').config({ path: 'config.env' });

const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Root route
app.get("/", (req, res) => {
  res.send("Order Service is running 🚀");
});

const SECRET = process.env.JWT_SECRET || "mysecretkey";

// 🔐 Middleware to verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

// 📦 Protected route
app.get('/orders', authenticateToken, (req, res) => {
    res.json({
        message: "Order data fetched successfully",
        orders: [
            { id: 101, item: "Laptop" },
            { id: 102, item: "Phone" }
        ]
    });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Order service running on ${PORT}`);
});
