const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Server is running on ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get("/privacy", (req, res) => {
  res.sendFile(__dirname + "/public/privacy.html");
});
app.get("/terms", (req, res) => {
  res.sendFile(__dirname + "/public/terms.html");
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "my_secure_whatsapp_token001"; // you can change this to whatever you want

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

app.post("/webhook", (req, res) => {
  try {
    const body = req.body;

    // Just log it safely
    console.log("🔔 Incoming webhook:");
    console.dir(body, { depth: null });

    // Respond 200 if it looks like a valid webhook payload
    if (body && body.object === "whatsapp_business_account") {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error("❌ Error in webhook:", err);
    res.sendStatus(500);
  }
});
