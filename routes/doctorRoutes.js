const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const auth = require("../middleware/auth");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// find a doctor with the given userId
router.post("/get-doctor-info-by-user-id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    // if no doctor is found, return an error
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Fejl",
      });
    }
    // otherwise, return the doctor's information
    return res.status(200).send({
      success: true,
      message: "Læge information indlæst",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Fejl i indlæsningen",
      error,
    });
  }
});

// find a doctor with the given doctorId
router.post("/get-doctor-info-by-id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    // if no doctor is found, return an error
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Fejl",
      });
    }
    // otherwise, return the doctor's information
    return res.status(200).send({
      success: true,
      message: "Læge information indlæst",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Fejl",
      error,
    });
  }
});

// update a doctor's profile
router.post("/update-doctor-profile", auth, async (req, res) => {
  try {
    // create a new object with the updated doctor's profile data
    const doctorUpdateData = { ...req.body };
    // hash the password before saving it to the database
    doctorUpdateData.password = await bcrypt.hash(
      doctorUpdateData.password,
      10
    );
    // update the doctor's record in the database
    const doctor = await Doctor.findOneAndUpdate(
      { userId: doctorUpdateData.userId },
      doctorUpdateData
    );
    // update the user's record in the database with the hashed password
    await User.findOneAndUpdate(
      { _id: doctorUpdateData.userId },
      { email: doctorUpdateData.email, password: doctorUpdateData.password }
    );
    // send a success response with the updated doctor's data
    res.status(200).send({
      success: true,
      message: "Profil opdateret",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({ message: "Fejl", success: false, error });
  }
});

// get a doctor's appointments
router.get("/get-appointments-by-doctor-id", auth, async (req, res) => {
  try {
    // find the doctor in the database
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) {
      // send an error response if the doctor's was not found
      return res.status(404).send({ message: "Fejl", success: false });
    }
    // find the doctor's appointments in the database
    const appointments = await Appointment.find({ doctorId: doctor._id });
    // send a success response with the doctor's appointments
    res.status(200).send({
      message: "Reserveringer indlæst",
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({ message: "Fejl", success: false, error });
  }
});

// change an appointment's status
router.post("/change-appointment-status", auth, async (req, res) => {
  try {
    // get the appointmentId and status from the request body
    const { appointmentId, status } = req.body;
    // update the appointment's status in the database
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });
    if (!appointment) {
      return res
        .status(404)
        .send({ message: "Reservering ikke fundet", success: false });
    }
    // find the user associated with the appointment
    const user = await User.findOne({ _id: appointment.userId });
    // add a notification to the user's unseenNotifications array
    user.unseenNotifications.push({
      type: "Reservations status ændret",
      message: `Din reservering er blevet ${status}`,
      onClickPath: "/appointments",
    });
    // save the updated user's record to the database
    await user.save();
    res.status(200).send({
      message: "Reservering opdateret",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

module.exports = router;
