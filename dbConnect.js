const mongoose = require("mongoose");
// connect to MongoDB using the URL specified in the MONGO_URL environment variable
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// get the connection instance
const connection = mongoose.connection;
// bind to the connected event and log a message
connection.on("connected", () => {
  console.log("MongoDB is connected");
});
// bind to the error event and log an error message
connection.on("error", (error) => {
  console.log("MongoDB connection error", error);
});

module.exports = mongoose;
