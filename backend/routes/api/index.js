// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const groupsRouter = require("./groups.js");
const venuesRouter = require("./venues.js");
const eventsRouter = require("./events.js");
const groupImagesRouter = require("./groupImages.js");
const eventImagesRouter = require("./eventImages.js");
const { restoreUser } = require("../../utils/auth.js");


router.use(restoreUser);

router.use("/groups", groupsRouter);

router.use("/session", sessionRouter);

router.use("/events", eventsRouter);

router.use("/group-images", groupImagesRouter);

router.use("/event-images", eventImagesRouter);

router.use("/venues", venuesRouter);

router.use("/users", usersRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
