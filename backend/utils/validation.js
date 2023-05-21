// backend/utils/validation.js
const { validationResult } = require("express-validator");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.param] = error.msg));

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const getVenue = ({ address, city, state, lat, lng }) => {
  const errRes = {
    status: 400,
    message: "Bad Request",
    errors: {},
  };

  if (!address) {
    errRes.errors.address = "Street address is required";
  }
  if (!city) {
    errRes.errors.city = "City is required";
  }
  if (!state) {
    errRes.errors.state = "State is required";
  }
  if (!lat || Number.isNaN(Number(lat))) {
    errRes.errors.lat = "Latitude is not valids";
  }
  if (!lng || Number.isNaN(Number(lng))) {
    errRes.errors.lng = "Longitude is not valid";
  }

  if (Object.keys(errRes.errors).length > 0) {
    throw errRes;
  }
  return {
    address,
    city,
    state,
    lng,
    lat,
  };
};

module.exports = {
  handleValidationErrors,
  getVenue,
};
