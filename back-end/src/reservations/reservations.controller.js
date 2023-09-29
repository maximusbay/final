/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


function validateDataExists(req, res, next) {
  console.log("Request Body:", req.body); // Log the request body to see what's being sent.
  if (req.body && req.body.data) {
    return next();
  }
  next({ status: 400, message: 'Data is missing in the request body' });
}

function validateStringField(field) {
  return function (req, res, next) {
    const value = req.body.data[field];
    if (value && typeof value === 'string' && value.trim() !== '') {
      return next();
    }
    next({ status: 400, message: `${field} is missing or empty.` });
  }
}

// A generic validator for date and time fields
function validateDateField(field) {
  return function (req, res, next) {
    const value = req.body.data[field];
    const regex = field === 'reservation_date' 
                  ? /^\d{4}-\d{2}-\d{2}$/ 
                  : /^\d{2}:\d{2}$/;
    if (regex.test(value)) {
      return next();
    }
    next({ status: 400, message: `${field} is missing or has an incorrect format.` });
  }
}

// Validator for people field
function validatePeople(req, res, next) {
  const { people } = req.body.data;
  if (typeof people === 'number' && people > 0) {
    return next();
  }
  next({ status: 400, message: `people must be a number greater than 0.` });
}

function validateReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;
  
  const reservationDate = new Date(reservation_date);
  const currentDate = new Date();
  
  // to compare only the date part and not the time, reset the time part of both dates.
  reservationDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  if (reservationDate < currentDate) {
    return next({
      status: 400,
      message: `Reservation must be in the future.`
    });
  }
  
  next();
}

async function validateDayIsNotTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const day = new Date(reservation_date).getUTCDay();
  
  if(day === 2) // 2 corresponds to Tuesday
    return next({ status: 400, message: 'The restaurant is closed on Tuesdays.' });

  next();
}

function validateReservationTimeBounds(req, res, next) {
  const { reservation_time } = req.body.data;
  const [hour, minute] = reservation_time.split(':').map(Number);
  const timeInMinutes = hour * 60 + minute;

  if (timeInMinutes < 630 || timeInMinutes > 1290)
      return next({
          status: 400,
          message: "Reservation time must be between 10:30 AM and 9:30 PM.",
      });

  next();
}

async function read(req, res, next) {
  const { reservation_Id } = req.params;
  const data = await service.read(reservation_Id);
  if (!data) return next({ status: 404, message: `Reservation ${reservation_Id} cannot be found.` });
  res.json({ data });
}

async function list(req, res) {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const data = await service.list(date);
  res.json({ data });
}

async function create(req, res) {
  const newReservation = req.body.data; 
  const data = await service.create(newReservation);
  res.status(201).json({ data });
}

async function update(req, res) {
   const { reservation_id } = req.params;
   const updatedReservation = {
      ...req.body.data, 
      reservation_id: reservation_id, 
      status: "seated" 
  };
  const data = await service.update(updatedReservation); 
  res.json({ data }); 
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateDataExists),
    asyncErrorBoundary(validateStringField('first_name')),
    asyncErrorBoundary(validateStringField('last_name')),
    asyncErrorBoundary(validateStringField('mobile_number')),
    asyncErrorBoundary(validateDateField('reservation_date')),
    asyncErrorBoundary(validateDateField('reservation_time')),
    asyncErrorBoundary(validatePeople),
    asyncErrorBoundary(validateDayIsNotTuesday),
    asyncErrorBoundary(validateReservationDate),
    asyncErrorBoundary(validateReservationTimeBounds),
    asyncErrorBoundary(create)
  ],
  update: asyncErrorBoundary(update),
  read
};
