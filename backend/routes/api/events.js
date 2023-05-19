const router = require("express").Router();
const {
  Event,
  Group,
  Venue,
  EventImage,
  Attendance,
} = require("../../db/models");

router.get("/", async (req, res) => {
  try {
    // Fetch events from the database, including associated data
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
      // Create a plain JavaScript object for the event
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

      // Count the number of attendees for the event
      const numAttending = await Attendance.count({
        where: {
          eventId: event.id,
          status: ["attending", "waitlist"],
        },
      });

      // Assign the number of attendees to the event object
      eventPojo.numAttending = numAttending;

      // Find the preview image for the event
      for (const image of event.EventImages) {
        if (image.preview === true) {
          eventPojo.previewImage = image.url;
          break; // Exit the loop once a preview image is found
        }
      }

      // Remove the EventImages property from the event object
      delete eventPojo.EventImages;

      // Add the modified event object to the events array
      eventsArr.push(eventPojo);
    }

    // Send the response with the events array
    res.json({ Events: eventsArr });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving events." });
  }
});

module.exports = router;
