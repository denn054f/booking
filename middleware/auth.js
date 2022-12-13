const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // extract the JWT from the Authorization header
    const token = req.headers["authorization"].split(" ")[1];
    // verify the JWT and decode its payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // add the user Id from the JWT to the request body
    req.body.userId = payload.id;
    // call the next middleware in the chain
    next();
  } catch (error) {
    // if the JWT is invalid or not present, return a 401 Unauthorized error
    res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};
