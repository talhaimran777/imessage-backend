const express = require("express");
const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({ message: "Building backend for imessage clone!" });
});

app.listen(PORT, () => {
  console.log(`Server started listening on port => ${PORT}`);
});
