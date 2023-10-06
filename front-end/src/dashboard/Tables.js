import React from "react";
import { updateReservationStatus, updateTableStatus } from "../utils/api";

function Table({ tables }) { 
    const handleFinish = async (table) => {
        console.log("Reservation ID:", table.reservation_id);
        if(window.confirm("Is this table ready to seat new guests? This cannot be undone.") && table.reservation_id) {
            try {
                await updateReservationStatus(table.reservation_id, "finished");
                await updateTableStatus(table.table_id, "free");
                window.location.reload();
            } catch (error) {
                console.error('Error during update operation: ', error);
            }
        }
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Table Name</th>
                        <th>Capacity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tables.map((table) => {
                        return (
                            <tr key={table.table_id}>
                                <td>{table.table_name}</td>
                                <td>{table.capacity}</td>
                                <td>{table.status}</td>
                                <td>{table.status === "occupied" && 
                                    <button className="btn btn-info"
                                            onClick={() => handleFinish(table)} 
                                            data-table-id-finish={table.table_id}>Finish</button>}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Table;