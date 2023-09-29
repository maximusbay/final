const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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
    const { reservation_id } = req.body.data; // Adjust based on your actual request body structure
    if (reservation_id) {
        return next();
    }
    next({ status: 400, message: 'reservation_id is missing in the request body' });
}

async function list(req, res) {
    const data = await service.list()
    res.json({ data })
}

async function create(req, res) {
    const newTable = req.body.data;
    const data = await service.create(newTable);
    res.status(201).json({ data });
}

async function update(req, res, next) {
    try {
        const { table_id } = req.params;
        const { status, ...otherProps } = req.body.data; // Destructure the status, and otherProps you want to allow to be updated.
        
        const updatedTable = {
            ...otherProps,
            table_id,
            status: "occupied" // This ensures that status is always "occupied"
        };

        const [data] = await service.update(updatedTable); // Destructure the array to get the updated row
        
        if (!data) {
            return next({ status: 404, message: `Table with id ${table_id} not found` });
        }

        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
}

async function unseat(req, res, next) {
    const { table_id } = req.params;
    try {
        const table = await service.read(table_id); // Make sure service.read is implemented to fetch the table.
        if (!table) return next({ status: 404, message: `Table ${table_id} cannot be found.` });

        if (table.status !== "occupied") return next({ status: 400, message: `Table ${table_id} is not occupied.` });

        // unseat the table
        const updatedTable = await service.unseat(table_id);
        res.status(200).json({ data: updatedTable });
    } catch (error) {
        next(error);
    }
}

module.exports= {
    list: asyncErrorBoundary(list),
    create: [
        asyncErrorBoundary(validateDataExists),
        asyncErrorBoundary(validateStringField('table_name', 2)),
        asyncErrorBoundary(validateCapacity),
        asyncErrorBoundary(create)
    ],
    update: [
        asyncErrorBoundary(validateDataExists),
        asyncErrorBoundary(validateReservationIdExists),
        asyncErrorBoundary(update)
    ],
    unseat: asyncErrorBoundary(unseat)
}