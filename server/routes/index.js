const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ text: "the Node.js server" });
});

module.exports = router;
