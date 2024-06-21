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
    console.log(`${req.method} ${req.url}`);
    next();
});

// Check Single Number
app.get("/checknumber", async (req, res) => {
    const { phoneNumber } = req.query;
    try {
        const exists = await checkNumber(phoneNumber);
        res.json({ phoneNumber, exists });
    } catch (error) {
        console.error(`Error checking number ${phoneNumber}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Check Multiple Numbers
app.post("/checknumber", async (req, res) => {
    const { phoneNumbers } = req.body;
    try {
        const result = await checkNumberBulk(phoneNumbers);
        res.json({ phoneNumbers, result });
    } catch (error) {
        console.error(`Error checking numbers:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Started Server on port ${process.env.PORT || 3000}`);
    console.log(`Running in environment: ${process.env.NODE_ENV}`);
});
