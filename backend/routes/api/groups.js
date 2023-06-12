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
const {
  handleValidationErrors,
  getVenue,
} = require("../../utils/validation.js");

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
    where: {
      [Op.or]: [
        { organizerId: userId },
        { "$Organizer.id$": userId },
        { "$Users.id$": userId },
      ],
    },
    include: [
      {
        model: User,
        as: "Organizer",
        attributes: [],
      },
      {
        model: User,
        through: {
          attributes: [],
        },
        as: "Users",
        attributes: [],
      },
      {
        model: GroupImage,
        where: {
          preview: true,
        },
        attributes: ["url"],
        required: false,
      },
    ],
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

      const { url } =
        groupJson.GroupImages && groupJson.GroupImages[0]
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

router.get("/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const group = await Group.findByPk(groupId, {
      include: [
        { model: GroupImage },
        { model: Venue },
        { model: Membership },
        {
          model: User,
          as: "Organizer",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (group) {
      const numMembers = group.Memberships.length;

      const successBody = {
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        numMembers: numMembers,
        GroupImages: group.GroupImages.map((image) => ({
          id: image.id,
          url: image.url,
          preview: image.preview,
        })),
        Organizer: {
          id: group.Organizer.id,
          firstName: group.Organizer.firstName,
          lastName: group.Organizer.lastName,
        },
        Venues: group.Venues.map((venue) => ({
          id: venue.id,
          groupId: venue.groupId,
          address: venue.address,
          city: venue.city,
          state: venue.state,
          lat: venue.lat,
          lng: venue.lng,
        })),
      };

      successBody.Venues.forEach((venue) => {
        delete venue.createdAt;
        delete venue.updatedAt;
      });

      res.status(200).json(successBody);
    } else {
      res.status(404).json({ message: "Group couldn't be found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
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
  console.log("group Data", groupData, typeof groupData.private);

  const validationErrors = {};

  if (!groupData.name || groupData.name.length > 60) {
    console.log("1");
    validationErrors.name = "Name must be 60 characters or less";
  }

  if (!groupData.about || groupData.about.length < 50) {
    validationErrors.about = "About must be 50 characters or more";
    console.log("2");
  }

  if (!groupData.type || !["Online", "In person"].includes(groupData.type)) {
    validationErrors.type = "Type must be 'Online' or 'In person'";

    console.log("3");
  }

  if (!groupData.private || typeof groupData.private !== "boolean") {
    validationErrors.private = "Private must be a boolean";
    console.log("4");
  }

  if (!groupData.city) {
    validationErrors.city = "City is required";
    console.log("5");
  }

  if (!groupData.state) {
    validationErrors.state = "State is required";
    console.log("6");
  }

  if (Object.keys(validationErrors).length > 0) {
    res.status(400).json({
      message: "Bad Request",
      errors: validationErrors,
    });
    return;
  }

  try {
    const group = await Group.create(groupData);
    res.status(201).json({
      id: group.id,
      organizerId: group.organizerId,
      name: group.name,
      about: group.about,
      type: group.type,
      private: group.private,
      city: group.city,
      state: group.state,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = {};

      for (let field of Object.keys(error.errors)) {
        errors[field] = error.errors[field].message;
      }

      res.status(400).json({
        message: "Validation error",
        errors,
      });
    } else {
      res.status(400).json({ message: "Bad Request" });
    }
  }
});

router.post("/:groupId/images", requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const { id: userId } = req.user;
  const { url, preview } = req.body;

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      const error = new Error("Group couldn't be found");
      error.status = 404;
      throw error;
    }

    const isNotAuthorized = group.organizerId !== userId;
    if (isNotAuthorized) {
      const error = new Error("Forbidden");
      error.status = 403;
      throw error;
    }

    const newGroupImage = await GroupImage.create({ groupId, url, preview });
    await group.addGroupImage(newGroupImage);

    const createdImage = await GroupImage.findByPk(newGroupImage.id, {
      attributes: ["id", "url", "preview"],
    });

    return res.json(createdImage);
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});
router.put(
  "/:groupId",
  requireAuth,
  handleValidationErrors,
  async (req, res) => {
    const groupId = req.params.groupId;
    const groupData = {
      name: req.body.name,
      about: req.body.about,
      type: req.body.type,
      private: req.body.private,
      city: req.body.city,
      state: req.body.state,
    };

    const validationErrors = {};

    if (!groupData.name || groupData.name.length > 60) {
      validationErrors.name = "Name must be 60 characters or less";
    }

    if (!groupData.about || groupData.about.length < 50) {
      validationErrors.about = "About must be 50 characters or more";
    }

    if (!groupData.type || !["Online", "In person"].includes(groupData.type)) {
      validationErrors.type = "Type must be 'Online' or 'In person'";
    }

    if (!groupData.private || typeof groupData.private !== "boolean") {
      validationErrors.private = "Private must be a boolean";
    }

    if (!groupData.city) {
      validationErrors.city = "City is required";
    }

    if (!groupData.state) {
      validationErrors.state = "State is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      res.status(400).json({
        message: "Bad Request",
        errors: validationErrors,
      });
      return;
    }

    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        res.status(404).json({ message: "Group couldn't be found" });
        return;
      }

      if (group.organizerId !== req.user.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      await group.update(groupData);

      res.status(200).json({
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.delete("/:groupId", requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findOne({ where: { id: groupId } });

  if (!group) {
    res.status(404).json({ message: "Group couldn't be found" });
  }

  const membership = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: req.user.id,
    },
  });

  if (group.organizerId != req.user.id) {
    if (!membership || membership.status !== "co-host") {
      return res.status(401).json({ message: "Forbidden" });
    }
  }

  await group.destroy();

  res.json({
    message: "Successfully deleted",
  });
});

router.get("/:groupId/venues", requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const group = await Group.findByPk(groupId, {
    include: {
      model: Venue,
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    },
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
    return res.status(403).json({ message: "Forbidden" });
  }
  const venues = group.Venues;
  if (venues.length === 0) {
    return res.status(404).json({ message: "No venues found for the group" });
  }

  res.json({ Venues: venues });
});

router.post("/:groupId/venues", requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const groupId = req.params.groupId;
  const { address, city, state, lat, lng } = req.body;

  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const isCoHost = await Membership.findOne({
    where: {
      userId,
      status: "co-host",
      groupId,
    },
  });

  const isNotAuthorized = group.organizerId !== userId && !isCoHost;
  if (isNotAuthorized) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const errors = {};

  if (!address) {
    errors.address = "Street address is required";
  }

  if (!city) {
    errors.city = "City is required";
  }

  if (!state) {
    errors.state = "State is required";
  }

  if (!lat) {
    errors.lat = "Latitude is not valid";
  }

  if (!lng) {
    errors.lng = "Longitude is not valid";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  const venue = await Venue.create({
    groupId,
    address,
    city,
    state,
    lat,
    lng,
  });

  const venueObject = {
    id: venue.id,
    groupId: venue.groupId,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    lat: venue.lat,
    lng: venue.lng,
  };

  return res.status(200).json(venueObject);
});

router.get("/:groupId/events", async (req, res, next) => {
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
      const group = await Group.findByPk(groupId);
      if (!group) {
        error = new Error("Group couldn't be found.");
        error.status = 404;
        error.title = "Resource couldn't be found.";
        return next(error);
      }
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
  } catch (err) {
    const error = new Error("Group couldn't be found.");
    error.status = 404;
    error.title = "Resource couldn't be found.";
    return next(error);
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

    const errors = {};

    // if (!venueId) {
    //   errors.venueId = "Venue ID is required";
    // } else {
    //   const venue = await Venue.findByPk(venueId);
    //   if (!venue) {
    //     errors.venueId = "Venue does not exist";
    //   }
    // }

    if (!name || name.length < 5) {
      errors.name = "Name must be at least 5 characters";
    }

    if (type !== "Online" && type !== "In person") {
      errors.type = "Type must be Online or In person";
    }

    if (!Number.isInteger(capacity)) {
      errors.capacity = "Capacity must be an integer";
    }

    if (typeof price !== "number" || isNaN(price)) {
      errors.price = "Price is invalid";
    }

    if (!description) {
      errors.description = "Description is required";
    }

    const currentDate = new Date();
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (parsedStartDate <= currentDate) {
      errors.startDate = "Start date must be in the future";
    }

    if (parsedEndDate <= parsedStartDate) {
      errors.endDate = "End date is less than start date";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
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

    const response = {
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      capacity: event.capacity,
      price: event.price,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
    };

    res.status(201).json(response);
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

  const myMembers = await Membership.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    where: whereClause,
  });

  const Members = [];

  for (const member of myMembers) {
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
