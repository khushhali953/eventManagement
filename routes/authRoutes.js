const router = require("express").Router();
const { register, login ,logout, getMe} = require("../controllers/authController");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/auth");

router.get("/google",
  passport.authenticate("google", {          //passport js use google k login page pe le gya
    scope: ["profile", "email"],
    prompt: "select_account"            //Har baar account choose karna auto login avoid hota hai
  })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
       path: "/"
    });

    res.redirect("/home.html");
  }
);

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMe);

module.exports = router;


