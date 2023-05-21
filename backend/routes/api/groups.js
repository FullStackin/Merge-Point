const router = require("express").Router();
const { Op } = require("sequelize");
const {
  Group,
  Membership,
  GroupImage,
  User,
  Venue,
  EventImage,
  Event,
  Attendance,
} = require("../../db/models");

const { requireAuth } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation.js");

router.get("/", async (req, res) => {
  const groups = await Group.findAll({
    include: {
      model: GroupImage,
      where: {
        preview: true,
      },
      attributes: ["url"],
      required: false,
    },
  });

  const newGroups = await Promise.all(
    groups.map(async (group) => {
      const groupJson = group.toJSON();
      const numMembers = await Membership.count({
        where: {
          groupId: groupJson.id,
          status: {
            [Op.in]: ["co-host", "member"],
          },
        },
      });

      const { url } = groupJson.GroupImages[0]
        ? groupJson.GroupImages[0]
        : { url: null };

      return {
        ...groupJson,
        numMembers,
        previewImage: url,
        GroupImages: undefined,
      };
    })
  );

  res.json({ Groups: newGroups });
});

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const groups = await Group.findAll({
    where: { [Op.or]: [{ organizerId: userId }] },
    include: [
      {
        model: User,
        as: "Organizer",
        attributes: [],
      },
      {
        model: User,
        through: { attributes: [] },
        as: "Users",
        attributes: [],
      },
    ],
  });

  res.json(groups);
});

router.get("/:groupId", (req, res) => {
  const groupId = req.params.groupId;

  Group.findByPk(groupId, { include: [GroupImage, Venue] })
    .then((group) => {
      if (group) {
        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group couldn't be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/", requireAuth, handleValidationErrors, async (req, res) => {
  const userId = req.user.id;
  const groupData = {
    organizerId: userId,
    name: req.body.name,
    about: req.body.about,
    type: req.body.type,
    private: req.body.private,
    city: req.body.city,
    state: req.body.state,
  };
  try {
    const group = await Group.create(groupData);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
});

router.post("/:groupId/images", async (req, res) => {
  const { user } = req;

  if (user) {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
      res.status(404);
      return res.json({
        message: "Group couldn't be found",
      });
    } else if (user.id != group.organizerId) {
      res.status(403);
      return res.json({
        message: "Forbidden",
      });
    }
    const { url, preview } = req.body;
    let newGroupImage = await GroupImage.create({
      url,
      preview,
      groupId: req.params.groupId,
    })
      .then(async (newImage) => {
        newGroupImage = await GroupImage.findOne({
          where: {
            id: newImage.id,
          },
          attributes: ["id", "url", "preview"],
        });
        return res.json(newGroupImage);
      })
      .catch(() => {});
  } else {
    res.status(401);
    res.json({
      message: "Authentication required",
    });
  }
});


router.put("/:groupId", requireAuth, (req, res) => {
  const groupId = req.params.groupId;
  const groupData = req.body;

  Group.findByPk(groupId)
    .then((group) => {
      if (group) {
        if (group.organizerId === req.user.id) {
          group
            .update(groupData)
            .then((updatedGroup) => {
              res.status(200).json(updatedGroup);
            })
            .catch((error) => {
              res.status(400).json({ message: "Bad Request" });
            });
        } else {
          res.status(403).json({ message: "Forbidden" });
        }
      } else {
        res.status(404).json({ message: "Group couldn't be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.delete("/:groupId", requireAuth, (req, res) => {
  const groupId = req.params.groupId;

  Group.findByPk(groupId)
    .then((group) => {
      if (group) {
        if (group.organizerId === req.user.id) {
          group
            .destroy()
            .then(() => {
              res.status(200).json({ message: "Successfully deleted" });
            })
            .catch((error) => {
              res.status(500).json({ message: "Internal Server Error" });
            });
        } else {
          res.status(403).json({ message: "Forbidden" });
        }
      } else {
        res.status(404).json({ message: "Group couldn't be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/:groupId/venues", requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const group = await Group.findByPk(groupId, {
    include: Venue,
  });
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  const isOrganizer = group.organizerId === req.user.id;
  const isMember = await Membership.findOne({
    where: {
      groupId,
      userId: req.user.id,
      status: "co-host",
    },
  });
  if (!isOrganizer && !isMember) {
    return res.status(403).json({ message: "Unauthorized action" });
  }
  const venues = group.Venues;
  if (venues.length === 0) {
    return res.status(404).json({ message: "No venues found for the group" });
  }
  res.status(200).json({ Venues: venues });
});

router.post(
  "/:groupId/venues",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const { groupId } = req.params;
    const { address, city, state, lat, lng } = req.body;
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }
    const isOrganizer = group.organizerId === req.user.id;
    const isCoHost = await Membership.findOne({
      where: {
        groupId,
        userId: req.user.id,
        status: "co-host",
      },
    });
    if (!isOrganizer && !isCoHost) {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    const venue = await Venue.create({
      groupId,
      address,
      city,
      state,
      lat,
      lng,
    });
    res.status(201).json(venue);
  }
);

router.get("/:groupId/events", async (req, res) => {
  const { groupId } = req.params;

  try {
    const events = await Event.findAll({
      where: {
        groupId: parseInt(groupId),
      },
      attributes: {
        exclude: ["description", "price", "capacity", "createdAt", "updatedAt"],
      },
      include: [
        { model: Group, attributes: ["id", "name", "city", "state"] },
        { model: Venue, attributes: ["id", "city", "state"] },
        { model: EventImage },
      ],
    });

    if (events.length === 0) {
      return entityNotFound(res, "Group");
    }

    const eventsArr = [];
    for (const event of events) {
      const eventPojo = event.toJSON();
      const numAttending = await Attendance.count({
        where: {
          eventId: event.id,
        },
      });

      eventPojo.numAttending = numAttending;
      eventPojo.previewImage = null;

      for (const image of eventPojo.EventImages) {
        if (image.preview === true) {
          eventPojo.previewImage = image.url;
          break;
        }
      }

      delete eventPojo.EventImages;

      eventsArr.push(eventPojo);
    }

    res.json({ Events: eventsArr });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving events." });
  }
});

router.post(
  "/:groupId/events",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const { groupId } = req.params;
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    const isOrganizer = group.organizerId === req.user.id;
    const isCoHost = await Membership.findOne({
      where: {
        groupId,
        userId: req.user.id,
        status: "co-host",
      },
    });

    if (!isOrganizer && !isCoHost) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (venueId) {
      const venue = await Venue.findByPk(venueId);
      if (!venue)
        return res.status(404).json({ message: "Venue couldn't be found" });
    }

    const event = await Event.create({
      groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    await group.addEvent(event);

    res.status(201).json(event);
  }
);

router.get("/:groupId/members", async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId,
    },
  });

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
    });
  }

  const membership = req.user
    ? await Membership.findOne({
        where: {
          groupId: req.params.groupId,
          userId: req.user.id,
        },
      })
    : null;

  const membershipStatus = ["co-host", "member"];
  const isOrganizerOrCoHost =
    req.user &&
    (group.organizerId === req.user.id ||
      (membership && membership.status === "co-host"));

  const whereClause = {
    groupId: group.id,
    ...(isOrganizerOrCoHost ? {} : { status: { [Op.in]: membershipStatus } }),
  };

  const oMembers = await Membership.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    where: whereClause,
  });

  const Members = [];

  for (const member of oMembers) {
    const user = await User.findOne({
      where: {
        id: member.userId,
      },
      attributes: ["id", "firstName", "lastName"],
    });

    const memberData = user.toJSON();
    memberData.Membership = {
      status: member.status,
    };

    Members.push(memberData);
  }

  return res.status(200).json({ Members });
});

router.post("/:groupId/membership", requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId,
    },
  });

  const membership = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id,
    },
  });

  if (!group)
    return res.status(404).json({ message: "Group couldn't be found" });

  if (membership) {
    if (membership.status === "pending") {
      return res.status(400).json({
        message: "Membership has already been requested",
      });
    } else {
      return res.status(400).json({
        message: "User is already a member of the group",
      });
    }
  } else {
    const newMember = await Membership.create({
      userId: req.user.id,
      groupId: req.params.groupId,
      status: "pending",
    });

    const returnMem = {
      memberId: newMember.userId,
      status: newMember.status,
    };

    return res.status(200).json(returnMem);
  }
});

router.put("/:groupId/membership", requireAuth, async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.groupId } });

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const membership = await Membership.findOne({
    where: { groupId: req.params.groupId, userId: req.user.id },
  });

  const { memberId, status } = req.body;
  const user = await User.findOne({ where: { id: memberId } });
  const newMembership = await Membership.findOne({
    where: { groupId: req.params.groupId, userId: memberId },
  });

  if (status === "pending") {
    return res.status(400).json({
      message: "Validations Error",
      errors: { status: "Cannot change a membership status to pending" },
    });
  }

  if (!user) {
    return res.status(400).json({
      message: "Validation Error",
      errors: { memberId: "User couldn't be found" },
    });
  }

  if (!newMembership) {
    return res.status(404).json({
      message: "Membership between the user and the group does not exist",
    });
  }

  if (status === "member") {
    if (
      group.organizerId !== req.user.id &&
      (!membership || membership.status !== "co-host")
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    newMembership.status = "member";
    await newMembership.save();
    return res.json({
      id: newMembership.id,
      groupId: newMembership.groupId,
      memberId,
      status: "member",
    });
  }

  if (status === "co-host") {
    if (group.organizerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    newMembership.status = "co-host";
    await newMembership.save();
    return res.json({
      id: newMembership.id,
      groupId: newMembership.groupId,
      memberId,
      status: "co-host",
    });
  }

  return res.status(400).json({ message: "Invalid status provided" });
});

router.delete("/:groupId/membership", requireAuth, async (req, res) => {
  const { memberId } = req.body;

  const member = await User.findOne({ where: { id: memberId } });
  if (!member) {
    return res.status(400).json({
      message: "Validation Error",
      errors: { memberId: "User couldn't be found" },
    });
  }

  const group = await Group.findOne({ where: { id: req.params.groupId } });
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const membership = await Membership.findOne({
    where: { userId: memberId, groupId: req.params.groupId },
  });
  if (!membership) {
    return res
      .status(404)
      .json({ message: "Membership does not exist for this User" });
  }

  if (group.organizerId === req.user.id || membership.userId === req.user.id) {
    await membership.destroy();
    return res.json({ message: "Successfully deleted membership from group" });
  }

  return res.status(403).json({ message: "Forbidden" });
});

module.exports = router;
