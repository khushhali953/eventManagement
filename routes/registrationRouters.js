const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middleware/auth");

const {
    registerEvent,
    getMyRegistrations,
    getRegisteredEvents,
    cancelRegistration
} = require("../controllers/registrationController");


// Register Event
router.post("/:id/register", isAuthenticated, registerEvent);

// Get Registered Event IDs
router.get("/my", isAuthenticated, getMyRegistrations);

// Get Registered Event Details
router.get("/my/events",isAuthenticated, getRegisteredEvents);

// Cancel Registration
router.delete("/:id/cancel", isAuthenticated, cancelRegistration);

module.exports = router;