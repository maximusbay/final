import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables } from "../utils/api";
import { updateTable } from "../utils/api";
 import { updateReservation } from "../utils/api";

function Seat(){
    const history = useHistory()
    const [ tables, setTables] = useState([])
    const [ tablesError, setTablesError] = useState(null)
    const [formData, setFormData] = useState({ table_id: ""});

    useEffect(loadTables, []);

    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      };

    function loadTables() {
        const abortController = new AbortController();
        listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError);
        return () => abortController.abort();
    }

  const { reservation_id: reservationId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedReservation = { status: "seated" };
    const updatedTable = { 
        status: "occupied",
        reservation_id: reservationId // Assuming reservationId holds the required reservation_id
    };
    await updateReservation(reservationId, updatedReservation);
    await updateTable(formData.table_id, updatedTable);
    history.goBack();
};

return (
    <div>
    <ErrorAlert error={tablesError}/>
    <form onSubmit={handleSubmit}>
      <div>
      <label htmlFor="table_id">Table number:</label>
      <select name="table_id" id="table_id" value={formData.table_id} onChange={handleChange}>
        {tables.map((table) => (
          <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        ))}
      </select>
      </div>
      <div>
      <button type="submit" className="btn btn-primary">Submit</button>
      <button type="button" onClick={() => history.goBack()} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
    </div>
  );
}

export default Seat