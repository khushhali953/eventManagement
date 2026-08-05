const Event = require("../models/Events");
const cloudinary = require("../config/cloudinary");
// const Registration = require("../models/Registration");
const Registration = require("../models/Registration");

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(           //we make pipe to uplaod data
          { folder: "events" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);                      //upload starts
      });

      imageUrl = result.secure_url;
    }

    const event = await Event.create({
      title: req.body.title,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      type: req.body.type,
      image: imageUrl
    });

    res.json(event);

  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getEvents = async (req, res) => {
  const events = await Event.find({});
  res.json(events);
};

// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.send("Deleted");
};

exports.getEventStats = async (req, res) => {
    try {
        // Total number of events
        const totalEvents = await Event.countDocuments();

        // Total number of registrations across all events
        const totalRegistrations = await Registration.countDocuments();

        // Most popular event = event with the most registrations
        const popular = await Registration.aggregate([
            {
                $group: {
                    _id: "$event",
                    registrationCount: { $sum: 1 }
                }
            },
            { $sort: { registrationCount: -1 } },
            { $limit: 1 }
        ]);

        let popularEvent = null;
        if (popular.length > 0) {
            popularEvent = await Event.findById(popular[0]._id);
        }

        res.json({
            totalEvents,
            totalRegistrations,
            popularEvent: popularEvent ? { title: popularEvent.title } : null
        });

    } catch (err) {
        console.error("Error fetching event stats:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.registerEvent = async (req, res) => {
    try {

        const eventId = req.params.id;
        const userId = req.user._id;

        const already = await Registration.findOne({
            user: userId,
            event: eventId
        });

        if (already) {
            return res.status(400).json({
                message: "Already Registered"
            });
        }

        const registration = await Registration.create({
            user: userId,
            event: eventId
        });

        res.json(registration);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};




exports.getRegisteredEvents = async (req, res) => {

    const data = await Registration.find({
        user: req.user._id
    }).populate("event");

    res.json(data);

};