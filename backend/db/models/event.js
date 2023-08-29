'use strict';

const { Model } = require('sequelize');
const { Op } = require("sequelize");
var validator = require('validator');


module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {
			Event.hasMany(models.EventImage, { foreignKey: "eventId" });
			Event.belongsToMany(models.User, {
				through: models.Attendance,
				foreignKey: "eventId", otherKey: "userId"
			});
			Event.belongsTo(models.Group, { foreignKey: "groupId" });
			Event.belongsTo(models.Venue, { foreignKey: "venueId" });
		}
	}
	Event.init({
		venueId: {
			type: DataTypes.INTEGER,
		},
		groupId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			onDelete: "cascade"
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [5]
			}
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM("In Person", "Online"),
			defaultValue: "In Person",
			validate: {
				isIn: [["In Person", "Online"]]
			}
		},
		capacity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
				isInt: true
			}
		},
		price: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
			validate: {
				isFloat: true,
				min: 0
			}
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				isDate: true,
				startsInFuture(value) {
					const startDate = new Date(value);
					if (startDate.getTime() < Date.now())
						throw new Error("Start date must be in the future");
				}
			}
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				isDate: true,
				mustEndAfterStart(value) {
					const startDate = new Date(this.startDate);
					const endDate = new Date(value);
					if (startDate.getTime() > endDate.getTime())
						throw new Error("End date must be after start date");
				}
			}
		},
	}, {
		sequelize,
		modelName: 'Event',
		scopes: {
			minimal() {
				return { attributes: ["id"] }
			},
			getPreviewImage() {
				const { EventImage } = require("../models");
				return {
					include: {
						model: EventImage,
						attributes: ["url"],
						where: { "preview": true },
						limit: 1,
						required: false
					}
				}
			},
			general() {
				const { Group, Venue } = require("../models");
				return {
					attributes: ["id", "name", "type", "groupId", "venueId", "startDate", "endDate", "description"],
					include: [
						{ model: Group, attributes: ["id", "name", "city", "state"] },
						{ model: Venue, attributes: ["id", "city", "state"] }
					],
					order: [["startDate"]]
				}
			},
			details() {
				const { Group, EventImage, Venue } = require("../models");
				return {
					attributes: ["capacity", "description", "price"],
					include: [
						{ model: Group, attributes: ["private"] },
						{ model: Venue, attributes: ["lat", "lng"] },
						{ model: EventImage, attributes: ["id", "url", "preview"] }
					]
				}
			},
			useQueryParams(query) {
				return { where: query.where, ...query.pagination }
			},
			includeAuthorization(userId) {
				const { Group } = require("../models");
				return {
					include: [{
						model: Group.scope([
							{ method: ["includeAuthorization", userId] }
						])
					}]
				}
			},
			filterByGroups(groupIds) {
				return { where: { "groupId": groupIds } }
			},
			filterByEvents(eventIds) {
				return { where: { "id": eventIds } }
			},
			getAttendees(isHost) {
				const { User } = require("../models");
				const where = (isHost) ? {} : { "status": { [Op.ne]: "pending" } }
				return {
					attributes: [],
					include: {
						model: User,
						attributes: ["id", "firstName", "lastName"],
						through: { attributes: ["status"], where: where }
					}
				}
			}
		}
	});
	return Event;
};
