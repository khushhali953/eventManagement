const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const sendEmail = require("../utils/sendEmail");

// SIGNUP
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.send("User already exists");
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashed,
    role: email === "khushhali224@gmail.com" ? "admin" : "user"
  });
 res.redirect("/login.html");
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email);
  console.log("Password:", password);
  const user = await User.findOne({ email });
  console.log("User:", user);
  if (!user) return res.send("User not found");
  console.log("Password from DB:", user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send("Invalid password");
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("token", token, { httpOnly: true });
  if (user.role === "admin") {
    res.redirect("/home.html");
  } else {
    res.redirect("/userHome.html");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.send("Logged out");
};

exports.getMe = (req, res) => {
  res.json(req.user);
};



// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Send login notification email (don't block the response on it)
//     sendEmail(
//       user.email,
//       "New Login to Your Eventify Account",
//       `<h2>Hi ${user.username || "there"},</h2>
//        <p>We noticed a new login to your Eventify account.</p>
//        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
//        <p>If this wasn't you, please reset your password immediately.</p>`
//     );

//     res.json({ message: "Login successful", user });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };