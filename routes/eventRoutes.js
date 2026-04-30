const router = require("express").Router();
const { createEvent, getEvents, deleteEvent ,getDashboardStats } = require("../controllers/eventController");
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), createEvent);        //form se file read karne k liye
router.post("/create", isAuthenticated, createEvent);
router.get("/", isAuthenticated, getEvents);
router.delete("/:id", isAuthenticated, deleteEvent);
router.get("/stats", isAuthenticated, getDashboardStats);

module.exports = router;