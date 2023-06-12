const express = require("express");
const mail = require("../controllers/mail.controller");

const router = express.Router();

router.route("/").post(mail.sendEmail);
module.exports = router;