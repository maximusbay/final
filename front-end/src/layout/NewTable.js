import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

function NewTable() {
  const history = useHistory();
  const defaultTableData = {
    table_name: "",
    capacity: 0,
  };
  const [tableData, setTableData] = useState({ ...defaultTableData });

  const changeHandler = (e) => {
    e.preventDefault();
    let value =
      e.target.name === "capacity" ? Number(e.target.value) : e.target.value;
    setTableData({
      ...tableData,
      [e.target.name]: value,
    });
    console.log(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const controller = new AbortController();
    createTable(tableData).then((newTable) => history.push(`/dashboard`));
    return () => controller.abort();
  };

  return (
    <div>
      <h2>Create Table</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Table Name</label>
          <input
            name="table_name"
            className="form-control"
            onChange={changeHandler}
          />
        </div>
        <div>
          <label>Capacity</label>
          <input
            name="capacity"
            className="form-control"
            onChange={changeHandler}
          />
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            onClick={() => history.goBack()}
            className="btn btn-secondary m-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTable;
