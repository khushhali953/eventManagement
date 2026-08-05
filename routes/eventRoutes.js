const router = require("express").Router();
const { createEvent, getEvents, deleteEvent, registerEvent, getRegisteredEvents, getEventStats} = require("../controllers/eventController");
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), createEvent);        //form se file read karne k liye
router.post("/create", isAuthenticated, createEvent);
router.get("/", isAuthenticated, getEvents);
router.delete("/:id", isAuthenticated, deleteEvent);
// router.get("/stats", isAuthenticated, getDashboardStats);
router.post("/:id/register", isAuthenticated, registerEvent);
router.get("/stats", getEventStats);   
router.get("/registered/me", isAuthenticated, getRegisteredEvents);
module.exports = router;