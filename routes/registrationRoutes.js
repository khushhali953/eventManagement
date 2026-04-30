const router = require("express").Router();
const {
  registerEvent,
  getMyRegistrations,
  unregisterEvent
} = require("../controllers/registrationController");

const { isAuthenticated } = require("../middleware/auth");


// 🔥 register event
router.post("/", isAuthenticated, registerEvent);

// 🔥 get my events
router.get("/my", isAuthenticated, getMyRegistrations);

// 🔥 unregister
router.delete("/:eventId", isAuthenticated, unregisterEvent);

module.exports = router;