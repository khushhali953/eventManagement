const Event = require("../models/Events");
const cloudinary = require("../config/cloudinary");
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


exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const popular = await Registration.aggregate([
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    let popularEvent = null;
    if (popular.length > 0) {
      popularEvent = await Event.findById(popular[0]._id);
    }
    res.json({
      totalEvents,
      totalRegistrations,
      popularEvent
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};