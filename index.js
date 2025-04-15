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
    console.log("🟢 Webhook POST received");

    const body = req.body;

    // Safe logging — avoids crashing even if undefined
    console.dir(body, { depth: null });

    if (body && body.object === "whatsapp_business_account") {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("❌ Error in webhook:", error.message);
    res.sendStatus(500);
  }
});
