const express = require("express");
const { GroupImage, Group, Membership } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  try {
    const image = await GroupImage.findByPk(req.params.imageId);
    if (!image) {
      res.status(404);
      return res.json({
        message: "Group Image couldn't be found",
      });
    }

    const group = await Group.findOne({
      where: {
        id: image.groupId,
      },
    });

    if (!group) {
      res.status(404);
      return res.json({
        message: "Group couldn't be found",
      });
    }

    const membership = await Membership.findOne({
      where: {
        groupId: image.groupId,
        userId: req.user.id,
        status: "co-host",
      },
    });

    if (group.organizerId !== req.user.id && !membership) {
      res.status(403);
      return res.json({
        message: "Forbidden",
      });
    }

    await image.destroy();
    res.json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
