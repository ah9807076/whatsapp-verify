const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// Utils
const checkNumber = require("./utils/checkNumber");
const checkNumberBulk = require("./utils/checkNumberBulk");

// Health check endpoint
app.get("/", (req, res) => {
    res.send("API is running");
});

// Logging middleware for better diagnostics
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Check Single Number
app.get("/checknumber", async (req, res) => {
    const { phoneNumber } = req.query;
    try {
        const exists = await checkNumber(phoneNumber);
        console.log(`[${new Date().toISOString()}] Checked number: ${phoneNumber}, Exists: ${exists}`);
        res.json({ phoneNumber, exists });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error checking number ${phoneNumber}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Check Multiple Numbers
app.post("/checknumber", async (req, res) => {
    const { phoneNumbers } = req.body;
    try {
        const result = await checkNumberBulk(phoneNumbers);
        console.log(`[${new Date().toISOString()}] Checked multiple numbers: ${phoneNumbers}, Results: ${result}`);
        res.json({ phoneNumbers, result });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error checking numbers:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Started Server on port ${PORT}`);
    console.log(`[${new Date().toISOString()}] Running in environment: ${process.env.NODE_ENV}`);
});
