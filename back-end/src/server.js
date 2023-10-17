const { PORT = 5001, DATABASE_URL } = process.env;

const app = require("./app");
const knex = require("./db/connection");

console.log(`Using DATABASE_URL: ${DATABASE_URL}`);

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("Migrations successful:", migrations);
    app.listen("0.0.0.0", PORT, listener);
  })
  .catch((error) => {
    console.error("Error running migrations:", error);
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
