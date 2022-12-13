const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const auth = require("../middleware/auth");
const Appointment = require("../models/appointmentModel");

// register new user
router.post("/register", async (req, res) => {
  try {
    // check if a user with the given email already exists in the database
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      // send an error response if a user with the given email already exists
      return res
        .status(200)
        .send({ message: "Brugeren findes allerede", success: false });
    }
    // hash the password provided in the request body
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    // create a new user with the hashed password and other data provided in the request body
    const newuser = new User(req.body);
    // save the new user's record to the database
    await newuser.save();
    // send a success response
    res.status(200).send({ message: "Bruger oprettet", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Fejl i oprettelsen", success: false, error });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    // attempt to find a user with the provided email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "Brugeren findes ikke", success: false });
    }
    // compare the provided password to the hashed password in the database
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Forkert kodeord", success: false });
    } else {
      // generate a JWT with the users Id and an expiration time of 1 day
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      // send a successful response with the JWT
      return res
        .status(200)
        .send({ message: "Logget ind", success: true, data: token });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Fejl i login", success: false, error });
  }
});

// user info
router.post("/get-user-info-by-id", auth, async (req, res) => {
  try {
    // use the authenticated user's Id to find the user in the database
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(404)
        .send({ message: "Brugeren findes ikke", success: false });
    }
    // remove the user's password from the returned data
    user.password = undefined;
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Fejl i indlæsningen af user info",
      success: false,
      error,
    });
  }
});

// update user
router.post("/update-user-profile", auth, async (req, res) => {
  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // update the user's information
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { ...req.body, password: hashedPassword },
      { new: true } // return the updated user object
    );
    res.status(200).send({
      success: true,
      message: "Profilen er opdateret",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: "Fejl i indlæsningen af user info",
      success: false,
      error,
    });
  }
});

// apply for a docter account
router.post("/doctor-application", auth, async (req, res) => {
  try {
    // create a new Doctor object using the request body and setting the status property to "pending"
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    // save the new Doctor object to the database
    await newDoctor.save();
    // find the admin user
    const adminUser = await User.findOne({ isAdmin: true });
    // add a new notification to the admin user's unseenNotifications array
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "Læge anmodning",
      message: `${newDoctor.firstName} ${newDoctor.lastName} har anmodet om en lægekonto`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/admin/DoctorList",
    });
    // update the admin user in the database
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "Anmodning sendt",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Fejl i anmodningen",
      success: false,
      error,
    });
  }
});

// mark notifications as seen
router.post("/mark-all-notifications-as-seen", auth, async (req, res) => {
  try {
    // find the user using the userId from the request body
    const user = await User.findOne({ _id: req.body.userId });
    // move all the notifications from the unseenNotifications array to the seenNotifications array
    user.seenNotifications.push(...user.unseenNotifications);
    user.unseenNotifications = [];
    // save the updated user to the database
    const updatedUser = await user.save();
    // remove the user's password before sending the response to the client
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifikationerne er markeret som set",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

// delete all notifications
router.post("/delete-all-notifications", auth, async (req, res) => {
  try {
    // find the user using the userId from the request body
    const user = await User.findOne({ _id: req.body.userId });
    // clear the user's seenNotifications and unseenNotifications arrays
    user.seenNotifications = [];
    user.unseenNotifications = [];
    // save the updated user to the database
    const updatedUser = await user.save();
    // remove the user's password before sending the response to the client
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifikationerne er slettet",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

// get approved doctors
router.get("/get-all-approved-doctors", auth, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.status(200).send({
      message: "Lægerne blev indlæst",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

// book appointment
router.post("/book-appointment", auth, async (req, res) => {
  try {
    // set the appointment's status and parse the date and time strings into ISO format
    const appointment = {
      ...req.body,
      status: "pending",
      date: moment(req.body.date, "DD-MM-YYYY").toISOString(),
      time: moment(req.body.time, "HH:mm").toISOString(),
    };
    // create a new Appointment object from the request body
    const newAppointment = new Appointment(appointment);
    // save the new appointment to the database
    await newAppointment.save();
    // find the user associated with the appointment and add a new notification
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "Reservation anmodning",
      message: `En aftale er anmodet af ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    // save the updated user to the database
    await user.save();
    res.status(200).send({
      message: "Aftale reserveret",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

// check if booking is available
router.post("/check-booking-availability", auth, async (req, res) => {
  try {
    // parse the date and time provided in the request body
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    // search for any appointments that match the specified date, time, and doctor. Time has to be >= or <= one hour
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    // check if any appointments were found
    if (appointments.length > 0) {
      // if appointments were found, send a response indicating that appointments are not available
      return res.status(200).send({
        message: "Reservering ikke tilgængelig",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Reservering tilgængelig",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Fejl i reservering",
      success: false,
      error,
    });
  }
});

// get appointments by user Id
router.get("/get-appointments-by-user-id", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    return res.status(200).send({
      message: "Reserveringer indlæst",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Fejl",
      success: false,
      error,
    });
  }
});

module.exports = router;
