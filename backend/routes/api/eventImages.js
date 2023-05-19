const express = require("express");
const router = express.Router();
const { Group, Membership, EventImage, Event } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

router.delete("/:imageId", requireAuth, async (req, res) => {
  const { id: currUserId } = req.user;
  const imageId = parseInt(req.params.imageId);

  try {
    const imageToDelete = await EventImage.findByPk(imageId);

    if (!imageToDelete) {
      return res.status(404).json({ error: "Event Image not found" });
    }

    const event = await Event.findByPk(imageToDelete.eventId, {
      include: [{ model: Group }],
    });

    const group = event.Group;

    const membershipStatus = await Membership.findOne({
      attributes: ["status"],
      where: {
        groupId: group.id,
        userId: currUserId,
      },
    });

    const hasValidRole =
      group.organizerId === currUserId ||
      membershipStatus?.status === "co-host";

    if (!hasValidRole) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await imageToDelete.destroy();
    res.json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
