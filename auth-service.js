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

// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Auth running on ${PORT}`);
});
