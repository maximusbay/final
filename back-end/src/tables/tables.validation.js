const service = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")

function validateDataExists(req, res, next) {
    if (req.body && req.body.data) {
        return next();
    }
    next({ status: 400, message: 'Data is missing in the request body' });
}

function validateStringField(field, minLength) {
    return function (req, res, next) {
        const value = req.body.data[field];
        if (value && typeof value === 'string' && value.trim().length >= minLength) {
            return next();
        }
        next({ status: 400, message: `${field} is missing or does not meet the minimum length of ${minLength}.` });
    }
}

function validateCapacity(req, res, next) {
    const { capacity } = req.body.data;
    if (typeof capacity === 'number' && capacity > 0) {
        return next();
    }
    next({ status: 400, message: `capacity must be a number greater than 0.` });
}

function validateReservationIdExists(req, res, next) {
    const { reservation_id } = req.body.data; 
    if (reservation_id) {
        return next();
    }
    next({ status: 400, message: 'reservation_id is missing in the request body' });
}

async function reservationIdExists(req, res, next) {
    const { reservation_id } = req.body.data;
    
    try {
        const reservation = await reservationsService.read(reservation_id); 
        
        if (!reservation) {
            return next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` });
        }
        
        res.locals.reservation = reservation;
        
        next();
    } catch (error) {
        next(error);
    }
}

async function validateTable(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id); 
    
    if (!table) {
        return next({ status: 404, message: `Table ${table_id} cannot be found.` });
    }

    if (table.status !== "occupied") {
        return next({ status: 400, message: `Table ${table_id} is not occupied.` });
    }

    res.locals.table = table; 
    next();
}

async function validateTableCapacity(req, res, next) {
    const { table_id } = req.params;
    const reservation = res.locals.reservation; 

    const table = await service.read(table_id);

    if (reservation.people > table.capacity) {
        return next({ status: 400, message: 'Table does not have sufficient capacity' });
    }

    next();
}

async function validateTableOccupied(req, res, next) {
    const { table_id } = req.params;

    const table = await service.read(table_id);

    if (table.status === "occupied") {
        return next({ status: 400, message: 'Table is already occupied' });
    }

    next();
}

async function validateNotAlreadySeated(req, res, next) {
    const { reservation_id } = req.body.data;

    const reservation = await reservationsService.read(reservation_id);

    // if (reservation.status === 'seated') {
    //     return next({ status: 400, message: `Reservation ${reservation_id} is already seated.` });
    // }

    res.locals.reservation = reservation;

    next();
}

module.exports = {
    validateDataExists,
    validateStringField,
    validateCapacity,
    validateReservationIdExists,
    reservationIdExists,
    validateTable,
    validateTableCapacity,
    validateTableOccupied,
    validateNotAlreadySeated
}