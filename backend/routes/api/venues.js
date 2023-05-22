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
    return res.status(404).json({ message: "Venue couldn't be found" });
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
    return res.status(401).json({ message: "Forbidden" });
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

  if (Object.keys(errorResult.errors).length > 0) {
    return res.status(400).json(errorResult);
  }

  venue.address = address;
  venue.city = city;
  venue.state = state;
  venue.lat = lat;
  venue.lng = lng;

  await venue.save();

  const venueObject = {
    id: venue.id,
    groupId: venue.groupId,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    lat: venue.lat,
    lng: venue.lng,
  };

  return res.json(venueObject);
});

module.exports = router;
