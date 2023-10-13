/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  validateReservationStatus,
  validateReservationExists,
  validateStatus,
  validateReservationTimeBounds,
  validateDayIsNotTuesday,
  validateReservationDate,
  validatePeople,
  validateDateField,
  validateDataExists,
  validateStringField,
} = require("./reservations.validation");

async function read(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);
  res.json({ data });
}

async function list(req, res) {
  const date = req.query.date || new Date().toISOString().split("T")[0];
  const data = await service.list(date);
  res.json({ data });
}

async function create(req, res) {
  const newReservation = req.body.data;
  const [data] = await service.create(newReservation);
  res.status(201).json({ data });
}

async function updateStatus(req, res) {
  const { status } = req.body.data;

  const updatedReservation = {
    ...res.locals.reservation,
    status: status,
  };

  const data = await service.update(updatedReservation);
  res.json({ data: data[0] });
}

async function search(req, res, next) {
  const { mobile_number } = req.query;
  if (!mobile_number) return next();
  try {
    const reservations = await service.search(mobile_number);
    res.json({ data: reservations });
  } catch (error) {
    next(error);
  }
}

async function update(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    ...req.body.data,
  };

  const [data] = await service.update(updatedReservation);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateDataExists),
    asyncErrorBoundary(validateStringField("first_name")),
    asyncErrorBoundary(validateStringField("last_name")),
    asyncErrorBoundary(validateStringField("mobile_number")),
    asyncErrorBoundary(validateDateField("reservation_date")),
    asyncErrorBoundary(validateDateField("reservation_time")),
    asyncErrorBoundary(validatePeople),
    asyncErrorBoundary(validateReservationDate),
    asyncErrorBoundary(validateDayIsNotTuesday),
    asyncErrorBoundary(validateReservationTimeBounds),
    asyncErrorBoundary(validateReservationStatus),
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(validateReservationExists),
    asyncErrorBoundary(validateStatus),
    asyncErrorBoundary(updateStatus),
  ],
  read: [
    asyncErrorBoundary(validateReservationExists),
    asyncErrorBoundary(read),
  ],
  search,
  update: [
    asyncErrorBoundary(validateReservationExists),
    asyncErrorBoundary(validateDataExists),
    asyncErrorBoundary(validateStringField("first_name")),
    asyncErrorBoundary(validateStringField("last_name")),
    asyncErrorBoundary(validateStringField("mobile_number")),
    asyncErrorBoundary(validateDateField("reservation_date")),
    asyncErrorBoundary(validateDateField("reservation_time")),
    asyncErrorBoundary(validatePeople),
    asyncErrorBoundary(validateDayIsNotTuesday),
    asyncErrorBoundary(validateReservationDate),
    asyncErrorBoundary(validateReservationTimeBounds),
    asyncErrorBoundary(validateStatus),
    asyncErrorBoundary(update),
  ],
};
