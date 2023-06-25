const express = require("express");
const mail = require("../controllers/mail.controller");
const { uploadFilePdf } = require("../middlewares/uploads/upload-pdf");
const router = express.Router();

router.route("/").post(mail.sendEmail);
router.route("/send-mail").post(uploadFilePdf("filePdf"), mail.sendEmailReport);
module.exports = router;
