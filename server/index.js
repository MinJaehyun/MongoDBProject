const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test method
app.get("/", (req, res) => {
  res.send("Server Run!");
});

// listen
app.listen(PORT, () => {
  console.log(`App listen is http://localhost:${PORT}`);
});