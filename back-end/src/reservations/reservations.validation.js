const service = require("./reservations.service");

function validateReservationStatus(req, res, next) {
  const { status } = req.body.data;

  if (!status || status === "booked") return next();

  if (["seated", "finished"].includes(status))
    return next({
      status: 400,
      message: `Status ${status} is not allowed for a new reservation.`,
    });

  next();
}

async function validateReservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const existingReservation = await service.read(reservation_id);
  if (!existingReservation) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    });
  }
  res.locals.reservation = existingReservation;
  next();
}

function validateStatus(req, res, next) {
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;

  if (!validStatuses.includes(status)) {
    return next({ status: 400, message: `Status ${status} is unknown.` });
  }

  if (currentStatus === "finished") {
    return next({
      status: 400,
      message: "A finished reservation cannot be updated.",
    });
  }

  next();
}

async function validateReservationTimeBounds(req, res, next) {
  const { reservation_time } = req.body.data;
  const [hour, minute] = reservation_time.split(":").map(Number);
  const timeInMinutes = hour * 60 + minute;

  if (timeInMinutes < 630 || timeInMinutes > 1290)
    return next({
      status: 400,
      message: "Reservation time must be between 10:30 AM and 9:30 PM.",
    });

  next();
}

async function validateDayIsNotTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const day = new Date(reservation_date).getUTCDay();

  if (day === 2)
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays.",
    });

  next();
}

function validateReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;

  const reservationDate = new Date(reservation_date);
  const currentDate = new Date();

  reservationDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  if (reservationDate < currentDate) {
    return next({
      status: 400,
      message: `Reservation must be in the future.`,
    });
  }

  next();
}

function validatePeople(req, res, next) {
  const { people } = req.body.data;
  if (typeof people === "number" && people > 0) {
    return next();
  }
  next({ status: 400, message: `people must be a number greater than 0.` });
}

function validateDateField(field) {
  return function (req, res, next) {
    const value = req.body.data[field];
    const regex =
      field === "reservation_date" ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{2}:\d{2}$/;
    if (regex.test(value)) {
      return next();
    }
    next({
      status: 400,
      message: `${field} is missing or has an incorrect format.`,
    });
  };
}

function validateDataExists(req, res, next) {
  console.log("Request Body:", req.body);
  if (req.body && req.body.data) {
    return next();
  }
  next({ status: 400, message: "Data is missing in the request body" });
}

function validateStringField(field) {
  return function (req, res, next) {
    const value = req.body.data[field];
    if (value && typeof value === "string" && value.trim() !== "") {
      return next();
    }
    next({ status: 400, message: `${field} is missing or empty.` });
  };
}

module.exports = {
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
};
