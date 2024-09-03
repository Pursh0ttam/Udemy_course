const express = require("express");
let router = express.Router();
router.get("/test", (req, res) => {
  console.log("this is test router");
  res.send("this is test route");
});