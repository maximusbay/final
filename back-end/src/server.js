const { PORT = 5001 } = process.env;
DATABASE_URL =
  "postgres://gyxqhtdo:gGpNAHKYu7aDnvFtmvJUfabYhhLxr-Pw@bubble.db.elephantsql.com/gyxqhtdo";

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
