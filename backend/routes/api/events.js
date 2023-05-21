const express = require("express");
const router = require("express").Router();
const {
  Event,
  User,
  Group,
  Venue,
  EventImage,
  Attendance,
  Membership,
} = require("../../db/models");

const { requireAuth } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation.js");

router.get("/", async (req, res) => {
  try {
    const { page = 1, size = 20, name, type, startDate } = req.query;

    const whereClause = {};
    if (name) {
      whereClause.name = name;
    }
    if (type) {
      whereClause.type = type;
    }
    if (startDate) {
      whereClause.startDate = startDate;
    }

    const events = await Event.findAndCountAll({
      include: [
        {
          model: Group,
          attributes: ["id", "name", "city", "state"],
        },
        {
          model: Venue,
          attributes: ["id", "city", "state"],
        },
        {
          model: EventImage,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      where: whereClause,
      attributes: {
        exclude: ["description", "capacity", "price", "createdAt", "updatedAt"],
      },
      limit: size,
      offset: (page - 1) * size,
    });

    const eventsArr = [];
    for (const event of events.rows) {
      const eventPojo = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending: 0,
        previewImage: null,
        Group: event.Group
          ? {
              id: event.Group.id,
              name: event.Group.name,
              city: event.Group.city,
              state: event.Group.state,
            }
          : null,
        Venue: event.Venue
          ? {
              id: event.Venue.id,
              city: event.Venue.city,
              state: event.Venue.state,
            }
          : null,
      };

      const numAttending = await Attendance.count({
        where: {
          eventId: event.id,
          status: ["attending", "waitlist"],
        },
      });

      eventPojo.numAttending = numAttending;

      for (const image of event.EventImages) {
        if (image.preview === true) {
          eventPojo.previewImage = image.url;
          break;
        }
      }

      delete eventPojo.EventImages;

      eventsArr.push(eventPojo);
    }

    const totalPages = Math.ceil(events.count / size); // Calculate total number of pages

    const response = {
      Events: eventsArr,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        totalPages: totalPages,
      },
    };

    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving events." });
  }
});

router.get("/:eventId", async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findByPk(eventId, {
    include: [
      {
        model: EventImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"],
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (!event) {
    const error = new Error("Event couldn't be found.");
    error.status = 404;
    error.title = "Resource couldn't be found.";
    return next(error);
  }

  const eventPojo = {
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    description: event.description,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    startDate: event.startDate,
    endDate: event.endDate,
    numAttending: 0,
    Group: event.Group
      ? {
          id: event.Group.id,
          name: event.Group.name,
          private: event.Group.private,
          city: event.Group.city,
          state: event.Group.state,
        }
      : null,
    Venue: event.Venue
      ? {
          id: event.Venue.id,
          address: event.Venue.address,
          city: event.Venue.city,
          state: event.Venue.state,
          lat: event.Venue.lat,
          lng: event.Venue.lng,
        }
      : null,
    EventImages: event.EventImages,
  };

  const numAttending = await Attendance.count({
    where: { eventId, status: ["waitlist", "attending"] },
  });
  eventPojo.numAttending = numAttending;

  res.json(eventPojo);
});

router.post("/:eventId/images", requireAuth, async (req, res) => {
  const { eventId } = req.params;
  const { url, preview } = req.body;

  // Find the event
  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  // Create a new image for the event
  const image = await EventImage.create({
    eventId,
    url,
    preview,
  });

  res.status(201).json({
    id: image.id,
    url: image.url,
    preview: image.preview,
  });
});

router.put("/:eventId", requireAuth, async (req, res) => {
  const event = await Event.findOne({
    where: {
      id: req.params.eventId,
    },
    attributes: {
      exclude: ["updatedAt", "createdAt"],
    },
  });

  if (!event) {
    res.status(404);
    return res.json({
      message: "Venue couldn't be found",
    });
  }

  const group = await Group.findOne({
    where: {
      id: event.groupId,
    },
  });

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const membership = await Membership.findOne({
    groupId: event.groupId,
    userId: req.user.id,
  });

  if (
    (group.organizerId !== req.user.id && !membership) ||
    (group.organizerId !== req.user.id && membership.status !== "co-host")
  ) {
    return res.status(401).json({ message: "Forbidden" });
  }

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

  let errResult = { message: "Bad Request", errors: {} };

  if (venueId) {
    const venue = await Venue.findByPk(venueId);
    if (!venue) errResult.errors.venueId = "Venue does not exist";
  }

  let validPrice = price.toString().split(".");
  if (Number.isNaN(price) || validPrice[1].length > 2) {
    errResult.errors.price = "Price is invalid";
  }
  if (!name || name.length < 5) {
    errResult.errors.name = "Name must be at least 5 characters";
  }
  if (type && !["Online", "In person"].includes(type)) {
    errResult.errors.type = "Type must be Online or In person";
  }
  if (!capacity || typeof capacity !== "number") {
    errResult.errors.capacity = "Capacity must be an integer";
  }
  if (!price || typeof price !== "number") {
    errResult.errors.price = "Price is invalid";
  }
  if (!description) {
    errResult.errors.description = "Description is required";
  }
  if (startDate && new Date() > new Date(startDate)) {
    errResult.errors.startDate = "Start date must be in the future";
  }

  if (endDate && startDate && endDate < startDate) {
    errResult.errors.endDate = "End date is less than start date";
  }

  if (Object.keys(errResult.errors).length) {
    return res.status(400).json(errResult);
  }

  if (
    venueId ||
    name ||
    type ||
    capacity ||
    price ||
    description ||
    startDate ||
    endDate
  ) {
    event.set({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });
  }
  event.save();
  res.json(event);
});

router.delete("/:eventId", requireAuth, async (req, res) => {
  const event = await Event.findOne({
    where: { id: req.params.eventId },
    attributes: { exclude: ["updatedAt", "createdAt"] },
  });

  if (!event)
    return res.status(404).json({ message: "Event couldn't be found" });

  const group = await Group.findOne({ id: event.groupId });

  const membership = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
    },
  });

  // return res.json({ group, membership });

  if (group.organizerId != req.user.id) {
    if (!membership || membership.status !== "co-host") {
      return res.status(401).json({ message: "Forbidden" });
    }
  }

  await event.destroy();

  res.json({
    message: "Successfully deleted",
  });
});

router.get("/:eventId/attendees", async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const group = await Group.findByPk(event.groupId);
  const membership = await Membership.findOne({
    where: {
      groupId: group.id,
      userId: req.user.id,
      status: "co-host",
    },
  });

  const allAttend = await Attendance.findAll({
    where: {
      eventId: req.params.eventId,
    },
  });

  let Attendees = [];

  const getUserData = async (userId, status) => {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      attributes: ["id", "firstName", "lastName"],
    });

    const userJSON = user.toJSON();
    userJSON.Attendance = {
      status: status,
    };

    return userJSON;
  };

  for (let person of allAttend) {
    if (group.organizerId == req.user.id || membership) {
      const user = await getUserData(person.userId, person.status);
      Attendees.push(user);
    } else {
      if (person.status !== "pending") {
        const user = await getUserData(person.userId, person.status);
        Attendees.push(user);
      }
    }
  }

  res.json({ Attendees: Attendees });
});

router.post("/:eventId/attendance", requireAuth, async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const membership = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: event.groupId,
    },
  });

  if (!membership) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const alreadyAttending = await Attendance.findOne({
    where: {
      userId: req.user.id,
      eventId: req.params.eventId,
    },
  });

  if (alreadyAttending) {
    if (alreadyAttending.status === "pending") {
      return res
        .status(400)
        .json({ message: "Attendance has already been requested" });
    } else {
      return res
        .status(400)
        .json({ message: "User is already an attendee of the event" });
    }
  } else {
    const newAttend = await Attendance.create({
      userId: req.user.id,
      eventId: req.params.eventId,
      status: "pending",
    });

    return res.json({ userId: req.user.id, status: "pending" });
  }
});

router.put("/:eventId/attendance", requireAuth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await findEventById(eventId);

    if (!event) {
      return sendErrorResponse(res, 404, "Event couldn't be found");
    }

    const groupId = event.groupId;
    const userId = req.user.id;
    const { userId: editedUserId, status } = req.body;

    const group = await findGroupById(groupId);
    const membership = await findMembership(userId, groupId, "co-host");
    const attendance = await findAttendanceByUserIdAndEventId(
      editedUserId,
      event.id
    );

    if (!isAuthorized(group, membership, userId)) {
      return sendErrorResponse(res, 403, "Forbidden");
    }

    if (status === "pending") {
      return sendErrorResponse(
        res,
        400,
        "Cannot change an attendance status to pending"
      );
    }

    if (!attendance) {
      return sendErrorResponse(
        res,
        404,
        "Attendance between the user and the event does not exist"
      );
    }

    attendance.status = status;
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      "An error occurred while processing the request"
    );
  }
});

async function findEventById(id) {
  return Event.findByPk(id);
}

async function findGroupById(id) {
  return Group.findByPk(id);
}

async function findMembership(userId, groupId, status) {
  return Membership.findOne({
    where: {
      userId,
      groupId,
      status,
    },
  });
}

async function findAttendanceByUserIdAndEventId(userId, eventId) {
  return Attendance.findOne({
    where: {
      userId,
      eventId,
    },
  });
}

function isAuthorized(group, membership, userId) {
  return group.organizerId !== userId && !membership;
}

function sendErrorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ message });
}

router.delete("/:eventId/attendance", requireAuth, async (req, res) => {
  try {
    const event = await findEventById(req.params.eventId);

    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }

    const group = await findGroupById(event.groupId);

    const { userId } = req.body;

    const attendance = await findAttendanceByUserIdAndEventId(userId, event.id);

    if (!attendance) {
      res.status(404);
      return res.json({
        message: "Attendance does not exist for this User",
      });
    }

    if (!isAuthorizedToDelete(group, userId, req.user.id)) {
      res.status(403);
      return res.json({
        message: "Only the User or organizer may delete an Attendance",
      });
    }

    await attendance.destroy();
    res.json({
      message: "Successfully deleted attendance from event",
    });
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      "An error occurred while processing the request"
    );
  }
});

async function findEventById(id) {
  return Event.findByPk(id);
}

async function findGroupById(id) {
  return Group.findByPk(id);
}

async function findAttendanceByUserIdAndEventId(userId, eventId) {
  return Attendance.findOne({
    where: {
      userId,
      eventId,
    },
  });
}

function isAuthorizedToDelete(group, userId, organizerId) {
  return group.organizerId === organizerId || userId === organizerId;
}

function sendErrorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ message });
}

module.exports = router;
