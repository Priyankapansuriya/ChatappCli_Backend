const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const nodemailer = require("nodemailer");

// router.get('/home', (req, res) => {
//     res.send("Hello World");
// })

async function mailer(recieveremail, code) {
  // console.log("Mailer function called");

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.NodeMailer_email, // generated ethereal user
      pass: process.env.NodeMailer_password, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: "ChatApp",
    to: `${recieveremail}`,
    subject: "Email Verification",
    text: `Your Verification Code is ${code}`,
    html: `<b>Your Verification Code is ${code}</b>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post("/verify", (req, res) => {
  console.log("sent by client", req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    try {
      let VerificationCode = Math.floor(100000 + Math.random() * 900000);
      await mailer(email, VerificationCode);
      console.log("Verification Code", VerificationCode);
      res.send({
        message: "Verification Code Sent to your Email",
        VerificationCode,
        email,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});

// change username

router.post("/changeusername", (req, res) => {
  const { username, email } = req.body;

  User.find({ username }).then(async (savedUser) => {
    if (savedUser.length > 0) {
      return res.status(422).json({ error: "Username already exists" });
    } else {
      return res
        .status(200)
        .json({ message: "Username Available", username, email });
    }
  });
});

// for signup

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    const user = new User({
      username,
      email,
      password,
    });

    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ message: "User Registered Successfully", token });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ error: "User Not Registered" });
    }
  }
});

module.exports = router;
