const express = require("express");
const { Group, GroupImage } = require("../../db/models");
const { Op } = require("sequelize");

const router = express.Router();

// Get all Groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll();
  res.json({ Groups: groups });
});

// Get all Groups joined or organized by the Current User
router.get("/current", async (req, res) => {
    const userId = req.user.id;
    try {
      const groups = await Group.findAll({
        where: {
          [Op.or]: [{ organizerId: userId }, { memberIds: { [Op.contains]: [userId] } }],
        },
      });
      res.json({ Groups: groups });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
