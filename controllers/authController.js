const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const user = await User.findOne({ email });
  if (!user) return res.send("User not found");
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