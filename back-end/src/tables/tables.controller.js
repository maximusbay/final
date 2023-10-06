const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
    validateNotAlreadySeated,
    validateDataExists,
    validateStringField,
    validateCapacity,
    validateReservationIdExists,
    reservationIdExists,
    validateTable,
    validateTableCapacity,
    validateTableOccupied,
} = require("./tables.validation")

async function list(req, res) {
    const data = await service.list()
    res.json({ data })
}

async function create(req, res) {
    const newTable = req.body.data;
    const [data] = await service.create(newTable);
    data.capacity = Number(data.capacity);
    res.status(201).json({ data });
}

async function update(req, res, next) {
    try {
        const { table_id } = req.params;
        const { reservation_id, ...otherProps } = req.body.data;
        
        await reservationsService.update({ reservation_id: reservation_id, status: 'seated' });

        const updatedTable = {
            ...otherProps,
            table_id,
            reservation_id,
            status: "occupied" 
        };

        const [data] = await service.update(updatedTable);
    
        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
}

async function unseat(req, res, next) {
    try {
        const { table_id } = req.params;
        const table = await service.read(table_id);
        const { reservation_id } = table;
        await reservationsService.update({ reservation_id, status: 'finished' });

        const updatedTable = {
            table_id,
            status: "free",
            reservation_id: null
        };

        const data = await service.update(updatedTable);
        res.status(200).json({ data });

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
        asyncErrorBoundary(validateNotAlreadySeated),
        asyncErrorBoundary(reservationIdExists),
        asyncErrorBoundary(validateTableCapacity),
        asyncErrorBoundary(validateTableOccupied),
        asyncErrorBoundary(update)
    ],
    unseat: [
        asyncErrorBoundary(validateTable), 
        asyncErrorBoundary(unseat)
    ],
}