const router = require("express").Router();
const {
  Event,
  Group,
  Venue,
  EventImage,
  Attendance,
} = require("../../db/models");

const { requireAuth, restoreUser } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation.js");

router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
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
      attributes: {
        exclude: ["description", "capacity", "price", "createdAt", "updatedAt"],
      },
    });

    const eventsArr = [];
    for (const event of events) {
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

    res.json({ Events: eventsArr });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving events." });
  }
});

router.get("/:eventId", async (req, res) => {
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
    return entityNotFound(res, "Event");
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

  // Check if the current user is authorized (attendee, host, or co-host)
  if (!requireAuth(req.currentUser, eventId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Find the event
  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  // Create a new image for the event
  const image = await Image.create({
    eventId,
    url,
    preview,
  });

  res.status(200).json(image);
});

router.put("/:eventId", restoreUser, requireAuth, async (req, res) => {
  const { eventId } = req.params;
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

  // Check if the current user is authorized (organizer or co-host)
  if (!requireAuth(req.currentUser, eventId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Find the event
  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  // Update the event with the provided data
  event.venueId = venueId;
  event.name = name;
  event.type = type;
  event.capacity = capacity;
  event.price = price;
  event.description = description;
  event.startDate = startDate;
  event.endDate = endDate;

  // Save the updated event
  await event.save();

  res.status(200).json(event);
});

router.delete("/:eventId", requireAuth, async (req, res) => {
  const { id: currUserId } = req.user;
  let { eventId } = req.params;
  eventId = parseInt(eventId);

  const eventToDelete = await Event.findByPk(eventId, {
    include: [{ model: Group }],
  });

  if (!eventToDelete) {
    return handleValidationErrors(res, "Event");
  }

  const group = eventToDelete.Group;

  const membershipStatus = await Membership.findOne({
    attributes: ["status"],
    where: { groupId: group.id, userId: currUserId },
  });

  const hasValidRole =
    group.organizerId === currUserId || membershipStatus?.status === "co-host";

  if (!hasValidRole) {
    return requireAuthResponse(res);
  }

  await eventToDelete.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
