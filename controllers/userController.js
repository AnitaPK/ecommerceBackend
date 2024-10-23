const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');
dotenv.config();

async function registerUser(req, res) {
    console.log(req.body);
    const { name, email, password, mobileNumber, role } = req.body;
  
    try {
      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(200).send({ message: "User already exists.", success: false });
      }
  
      const user = new User({ name, email, password, mobileNumber, role });
      await user.save();
  
      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to Our Service",
        text: `Hello ${name},\n\nWelcome to our ECommerce platform! We're excited to have you onboard.\n\nBest regards,\nEcoommerce Company`,
      };
  
      //welcome email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send({ message: 'Error sending email: ' + error.message, success: false });
        }
  
        return res.status(200).send({ message: 'Registration successful! Welcome email sent.', success: true });
      });
  
    } catch (err) {
      console.error("Error registering user:", err);
      return res.status(400).send({ message: err.message, success: false });
    }
  }

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).send({ message: "Invalid credentials", success: false });
    }
    const payload = { user: { id: user.id, role: user.role, name: user.name } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // console.log(token);
    res.status(202).send({ token: token, success: true });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
async function userInformation(req, res) {
  console.log("****", req.user);
  const id = req.user.id;
  try {
    const user = await User.findOne({ _id: id });
    console.log(user);
    if (!user) {
      res.status(200).send({ message: "User does not found.", success: false });
    } else {
      res.status(202).send({ user: user, success: true });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
}

module.exports = {
  registerUser,
  loginUser,
  userInformation,
};
