const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const auth = require("../middleware/auth");

// get all doctors
router.get("/get-all-doctors", auth, async (req, res) => {
  try {
    // retrieve all doctors from the database
    const doctors = await Doctor.find({});
    // send response with success message and the retrieved doctors
    res.set("Content-Type", "application/json");
    return res.status(200).json({
      message: "Læger indlæst",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.set("Content-Type", "application/json");
    return res.status(500).json({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

// get all users
router.get("/get-all-users", auth, async (req, res) => {
  try {
    // retrieve all users from the database
    const users = await User.find({});
    // set the response type to JSON
    res.set("Content-Type", "application/json");
    // send response with success message and the retrieved users
    return res.status(200).json({
      message: "Brugere indlæst",
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    // set the response type to JSON
    res.set("Content-Type", "application/json");
    return res.status(500).json({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

// change a doctor's account status
router.post("/change-doctor-account-status", auth, async (req, res) => {
  try {
    // destructure the doctorId and status from the request body
    const { doctorId, status } = req.body;
    // update the doctor's status
    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });
    // retrieve the user associated with the doctor
    const user = await User.findOne({ _id: doctor.userId });
    // add a notification to the user's unseen notifications
    user.unseenNotifications.push({
      type: "Læge anmodning er opdateret",
      message: `Din lægekonto er blevet ${status}`,
      onClickPath: "/notifications",
    });
    // update the user's isDoctor property based on the doctor's status
    user.isDoctor = status === "approved" ? true : false;
    // save the user's updated information
    await user.save();
    // set the response type to JSON
    res.set("Content-Type", "application/json");
    // send a response with a success message and the updated doctor
    return res.status(200).json({
      message: "Læge status opdateret",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    // set the response type to JSON
    res.set("Content-Type", "application/json");
    return res.status(500).json({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

module.exports = router;
