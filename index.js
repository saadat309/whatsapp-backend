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
