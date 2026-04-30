const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.send("Login required");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);       //Token sahi hai ya nahi check karo aur uske andar ka data nikaalo
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};