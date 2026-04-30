const Registration = require("../models/Registration");


// 🔥 REGISTER EVENT
exports.registerEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;

    const registration = await Registration.create({
      user: userId,
      event: eventId
    });

    res.json({
      success: true,
      message: "Event registered successfully"
    });

  } catch (err) {

    // 🔥 duplicate registration handle
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Already registered"
      });
    }

    res.status(500).json({ error: err.message });
  }
};


// 🔥 GET USER REGISTERED EVENTS
// exports.getMyRegistrations = async (req, res) => {
//   try {
//     // const data = await Registration.find({ user: req.user._id })
//     //   .populate("event");

//     // res.json(data);

//     const registrations = await Registration.find({ user: req.user._id })
//     .populate("event"); 
//   const events = registrations.map(r => r.event);

//   res.json(events);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event");

    // 🔥 null events avoid करो (अगर event delete हो चुका हो)
    const events = registrations
      .map(r => r.event)
      .filter(e => e !== null);

    res.json(events);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 UNREGISTER EVENT
exports.unregisterEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    await Registration.findOneAndDelete({
      user: req.user._id,
      event: eventId
    });

    res.json({ message: "Unregistered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};