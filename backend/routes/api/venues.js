const express = require("express");
var validator = require("validator");

const { Group, Membership, Venue } = require("../../db/models");

const { requireAuth } = require("../../utils/auth.js");
const router = express.Router();

router.put("/:venueId", requireAuth, async (req, res) => {
  const venue = await Venue.findOne({
    where: { id: req.params.venueId },
    attributes: { exclude: ["updatedAt", "createdAt"] },
  });

  if (!venue) {
    res.status(404).json({ message: "Venue couldn't be found" });
  }

  const group = await Group.findOne({
    where: { id: venue.groupId },
  });

  const membership = await Membership.findOne({
    where: {
      groupId: venue.groupId,
      userId: req.user.id,
    },
  });

  if (
    group.organizerId !== req.user.id &&
    (!membership || membership.status !== "co-host")
  ) {
    res.status(401).json({ message: "Authentication required" });
  }

  const { address, city, state, lat, lng } = req.body;
  const errorResult = { message: "Bad Request", errors: {} };

  if (!address) {
    errorResult.errors.address = "Street address is required";
  }

  if (!city) {
    errorResult.errors.city = "City is required";
  }

  if (!state) {
    errorResult.errors.state = "State is required";
  }

  if (!validator.isLatLong(`${lat},${lng}`)) {
    errorResult.errors.lat = "Latitude is not valid";
    errorResult.errors.lng = "Longitude is not valid";
  }

  if (Object.keys(errorResult.errors).length) {
    res.status(400).json(errorResult);
  }

  venue.address = address;
  venue.city = city;
  venue.state = state;
  venue.lat = lat;
  venue.lng = lng;

  await venue.save();

  res.json(venue);
});

module.exports = router;
