const Registration = require("../models/Registration");
const sendEmail = require("../utils/sendEmail"); // adjust path if needed
const Event = require("../models/Events");

// Register for an Event
exports.registerEvent = async (req, res) => {
    try {

        const userId = req.user._id;
        const eventId = req.params.id;

        // Check if already registered
        const existing = await Registration.findOne({
            user: userId,
            event: eventId
        });

        if (existing) {
            return res.status(400).json({
                message: "You have already registered for this event."
            });
        }

        // Save registration
        await Registration.create({
            user: userId,
            event: eventId
        });
         
            const event = await Event.findById(eventId);

            // Send confirmation email (don't block the response on it)
            if (event) {
            sendEmail(
                req.user.email,
                `You're Registered: ${event.title}`,
                `<h2>Hi ${req.user.username || "there"},</h2>
                <p>You have successfully registered for <strong>${event.title}</strong>.</p>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p>We look forward to seeing you there!</p>`
            );
        }



            res.status(201).json({
                message: "Registration Successful"
            });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

// Get IDs of all events registered by logged-in user
exports.getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({
            user: req.user._id
        }).populate("event");

        res.json(registrations);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// Cancel Registration
exports.cancelRegistration = async (req, res) => {
    try {

        const userId = req.user._id;
        const eventId = req.params.id;

        await Registration.findOneAndDelete({
            user: userId,
            event: eventId
        });

        res.json({
            message: "Registration Cancelled Successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};


exports.getRegisteredEvents = async (req, res) => {
    try {

        const registrations = await Registration.find({
            user: req.user._id
        }).populate("event");

        console.log("Registrations:", registrations);

        const events = registrations
            .filter(r => r.event)
            .map(r => r.event);

        console.log("Events:", events);

        res.json(events);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};