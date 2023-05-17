const router = require("express").Router();
const { Op } = require("sequelize");
const { Group, User, GroupImage, Venue } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation.js");

// Get all Groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll();

  res.json(groups);
});

// Get all Groups joined or organized by the Current User
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

// Get details of a Group from an id
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

// Create a Group
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

// Add an Image to a Group based on the Group's id
router.post("/:groupId/images", requireAuth, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const imageData = req.body;

    const group = await Group.findByPk(groupId);

    if (group) {
      if (group.organizerId === req.user.id) {
        const image = await GroupImage.create({ groupId, ...imageData });
        res.status(201).json(image);
      } else {
        res.status(404).json({ message: "Group couldn't be found" });
      }
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit a Group
router.put("/:groupId", requireAuth, (req, res) => {
  const groupId = req.params.groupId;
  const groupData = req.body;

  Group.findByPk(groupId)
    .then((group) => {
      if (group) {
        // Check if the current user is the organizer of the group
        if (group.organizerId === req.user.id) {
          // User has access, update the group
          group
            .update(groupData)
            .then((updatedGroup) => {
              res.status(200).json(updatedGroup);
            })
            .catch((error) => {
              res.status(400).json({ message: "Bad Request" });
            });
        } else {
          // User does not have access to update the group
          res.status(403).json({ message: "Forbidden" });
        }
      } else {
        // Group not found
        res.status(404).json({ message: "Group couldn't be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Delete a Group
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

module.exports = router;
