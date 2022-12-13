const express = require("express");
const app = express();
const path = require("path");

// load environment variables from .env file
require("dotenv").config();

// connect to database
require("./dbConnect.js");

// register middleware
app.use(express.json()); // enable JSON parsing for request bodies
app.use(express.static(path.join(__dirname, "public"))); // enable static file serving

// register routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

// deployment to heroku
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("test"));
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));
