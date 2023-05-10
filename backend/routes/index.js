// backend/routes/index.js
const express = require("express");
const router = express.Router();

router.get("/hello/world", function (req, res) {
  // Test route that sets a cookie and sends a response
  res.cookie("XSRF-TOKEN", req.csrfToken()); // Set a cookie named XSRF-TOKEN with the value of req.csrfToken()
  res.send("Hello World!"); // Send a response with the body "Hello World!"
});

// Export the router so it can be used in the application
module.exports = router;
