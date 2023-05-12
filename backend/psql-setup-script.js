const { sequelize } = require("./db/models"); // Importing the "sequelize" object from the "models.js" file in the "db" folder.

// Calling the "showAllSchemas" method on the "sequelize" object with an options object that turns off logging.
// This method will return a promise that resolves to an array of all the schema names in the database.
sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    // Checking if the array of schema names returned by the "showAllSchemas" method includes the value of the "SCHEMA" environment variable.
    await sequelize.createSchema(process.env.SCHEMA);
  }
});
