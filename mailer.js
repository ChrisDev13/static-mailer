
require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // Your Gmail
        pass: process.env.EMAIL_PASSWORD // App Password (not your actual password)
    }
});

// Handle form submission
app.post("/send", async (req, res) => {
    const { name, email, telephone, message, fromSite } = req.body;
    console.log(req.body)

    const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: `New ${fromSite} Contact Form Submission from ${name} - ${email} - ${telephone}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${telephone}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
console.error("Full send error:", error);
    console.error("Error code:", error.code);
    console.error("Response:", error.response);
    console.error("Message:", error.message);
    res.status(500).json({ success: false, message: "Email failed", error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
