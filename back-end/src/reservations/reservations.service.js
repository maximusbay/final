const knex = require("../db/connection")

function list(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .orderBy("reservation_time")
}

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
        .returning("*");
}

function update(updatedReservation) {
    return knex("reservations")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
}

function read(reservationId) {
    return knex("reservations").select("*").where({ reservation_id: reservationId }).first();
}

module.exports = {
    list,
    create,
    update,
    read
}