require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Email Transporter
const resend = new Resend(process.env.RESEND_API_KEY);
// Health check
app.get("/", (req, res) => {
  res.send("Mailer service running");
});

// Handle form submission
app.post("/send", async (req, res) => {
  const { name, email, telephone, message, fromSite } = req.body;

  try {
    await resend.emails.send({
      from: `${fromSite} <contact@yourride.co.za>`,
      to: [process.env.EMAIL],
      replyTo: email,
      subject: `New ${fromSite} Contact Form Submission`,
      text: `Name: ${name}
        Email: ${email}
        Phone: ${telephone}
        Message: ${message}`
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Email failed to send."
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
