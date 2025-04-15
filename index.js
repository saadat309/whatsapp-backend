require("dotenv").config();

const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send(`Server is running on ${PORT}`);
});

// Privacy and Terms routes
app.get("/privacy", (req, res) => {
  res.sendFile(__dirname + "/public/privacy.html");
});

app.get("/terms", (req, res) => {
  res.sendFile(__dirname + "/public/terms.html");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_SECURE_TOKEN; // Token from .env

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Webhook for incoming messages
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.entry) {
    body.entry.forEach((entry) => {
      entry.changes.forEach((change) => {
        const messages = change.value.messages;
        if (messages) {
          messages.forEach(async (msg) => {
            const replyMessage = "Adnan bhai kiya haal hai?";
            try {
              await sendMessage(msg.from, replyMessage);
            } catch (error) {
              console.error("Error sending reply:", error);
            }
          });
        }
      });
    });
  }

  res.sendStatus(200);
});

// Function to send a reply using WhatsApp Cloud API
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    text: {
      body: message,
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
  };

  try {
    await axios.post(url, data, { headers });
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
