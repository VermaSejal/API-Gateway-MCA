const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

// 🔥 Rate Limiting (IMPORTANT MILESTONE)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per minute
    message: "Too many requests, please try again later."
});

app.use(limiter);

// 🔗 Replace these with your actual Render URLs
const AUTH_SERVICE = "https://auth-service-pij9.onrender.com/";
const USER_SERVICE = "https://user-service-9r4l.onrender.com/";
const ORDER_SERVICE = "https://order-service-ikqm.onrender.com/";

// Root
app.get("/", (req, res) => {
    res.send("API Gateway is running 🚀");
});

// 🔐 Login Route → Auth Service
app.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE}/login`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Auth service error" });
    }
});

// 👤 Users Route → User Service
app.get('/users', async (req, res) => {
    try {
        const response = await axios.get(`${USER_SERVICE}/users`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "User service error" });
    }
});

// 📦 Orders Route → Order Service
app.get('/orders', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE}/orders`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Order service error" });
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`API Gateway running on ${PORT}`);
});
