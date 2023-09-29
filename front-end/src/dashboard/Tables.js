import React from "react"
import { handleFinish } from "../utils/api";

function Table({ tables }) {
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
                {tables.map((table) => {
                    return (
                        <tr>
                            <td>{table.table_name}</td>
                            <td>{table.capacity}</td>
                            <td>{table.status}</td>
                            <td>{table.status === "occupied" && 
                                 <button className="btn btn-info"
                                         onClick={() => handleFinish(table.table_id)} 
                                         data-table-id-finish={table.table_id}>Finish</button>}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}

export default Table