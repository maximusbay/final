import React from "react";
import { updateReservationStatus, updateTableStatus } from "../utils/api";

function Tables({ tables, onTableStatusChange }) {
  const handleFinish = async (tableToFinish) => {
    console.log("Reservation ID:", tableToFinish.reservation_id);
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      ) &&
      tableToFinish.reservation_id
    ) {
      try {
        await updateReservationStatus(tableToFinish.reservation_id, "finished");
        await updateTableStatus(tableToFinish.table_id, "free");
        onTableStatusChange();
      } catch (error) {
        console.error("Error during update operation: ", error);
      }
    }
  };

  return (
    <div className="table-responsive">
      <table className="table w-100">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => {
            const isOccupied = !!table.reservation_id;
            return (
              <tr key={table.table_id}>
                <td>{table.table_name}</td>
                <td>{table.capacity}</td>
                <td data-table-id-status={table.table_id}>
                  {isOccupied ? "occupied" : "free"}
                </td>
                <td>
                  {isOccupied && (
                    <button
                      className="btn btn-info"
                      onClick={() => handleFinish(table)}
                      data-table-id-finish={table.table_id}
                    >
                      Finish
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Tables;
