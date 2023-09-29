const knex = require("../db/connection")

function list() {
    return knex("tables").select("*").orderBy("table_name")
}

function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*");
}

function update(updatedTable) {
    return knex("tables")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
}

function unseat(table_id) {
    return knex("tables")
        .where({ table_id })
        .update({ status: "free" }, "*") // Assuming "free" is the status representing an unoccupied table.
        .then((rows) => rows[0]);
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

module.exports = {
    list,
    create,
    update,
    unseat,
    read
}