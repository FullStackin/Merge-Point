const { Venue, Group } = require("../../db/models");
const router = require("express").Router();

const { requireAuth } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation.js");

router.put(
  "/:venueId",
  requireAuth,
  handleValidationErrors,
  async (req, res) => {
    const { venueId } = req.params;
    const { address, city, state, lat, lng } = req.body;

    try {
      const venue = await Venue.findByPk(venueId);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }

      const group = await Group.findByPk(venue.groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      const isOrganizer = group.organizerId === req.user.id;
      const isCoHost = await group.hasMembership(req.user.id, {
        through: { status: "co-host", userId: req.user.id, groupId: group.id },
      });

      if (!isOrganizer && !isCoHost) {
        return res.status(403).json({ message: "Unauthorized action" });
      }

      await venue.update({ address, city, state, lat, lng });
      res.status(200).json(venue);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
