"use strict";

const express = require("express");
const addressSearch = require("./addressSearch/");

const router = express.Router();

router
  .get("/", (req, res) => {
    res.json({ text: "Hello from the server!" });
  })
  .use("/address-search", addressSearch);

module.exports = router;
