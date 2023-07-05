/////
const nodemailer = require("nodemailer");
const path = require("path");

exports.sendEmail = async (req, res, next) => {
  console.log("Nội dung mail:", req.body);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "maxvolum2012@gmail.com",
        pass: "wisbbpolajrseqqd",
      },
    });

    const mailOptions = {
      from: "maxvolum2012@gmail.com",
      to: req.body.mail,
      subject: req.body.title,
      html: req.body.content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    res.send({ msg: "Thành công" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.send({ msg: "Thất bại" });
  }
};

exports.sendEmailReport = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "maxvolum2012@gmail.com",
        pass: "wisbbpolajrseqqd",
      },
    });

    const filePath = path.join(
      __dirname,
      "../public/file/filePdf",
      req.file.filename
    );

    const mailOptions = {
      from: "maxvolum2012@gmail.com",
      to: req.body.mail,
      subject: req.body.title,
      html: req.body.content,
      attachments: [
        {
          filename: req.file.originalname,
          path: filePath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    return res.send({ error: false, msg: "Thành công" });
    // res.json({ msg: "Thành công" });
  } catch (error) {
    return res.json({ error: true, msg: error.message });
  }
};

exports.sendEmailMutilFile = async (req, res, next) => {
  const { mail, title, content } = req.body;
  // console.log("mail", mail, typeof mail);
  // console.log("title", title, typeof title);
  // console.log("content", content, typeof content);
  console.log("Req file", req.body);
  try {
    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      path: path.join(__dirname, "../public/file/file_multiple", file.filename),
    }));

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "maxvolum2012@gmail.com",
        pass: "wisbbpolajrseqqd",
      },
    });

    const mailOptions = {
      from: "maxvolum2012@gmail.com",
      to: mail,
      subject: title,
      html: content,
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.send({ error: false, msg: "Thành công" });
    // res.json({ msg: "Thành công" });
  } catch (error) {
    return res.json({ error: true, msg: error.message });
  }
};
