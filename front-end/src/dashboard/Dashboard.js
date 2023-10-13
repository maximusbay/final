import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";
import Reservations from "./Reservations";
import Tables from "./Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [dateString, setDateString] = useState(null);
  const location = useLocation();
  const history = useHistory();

  useEffect(loadDashboard, [location.search]);

  function reloadDashboardData() {
    loadDashboard(); // this function already loads the data for dashboard
  }

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);

    const queryParams = new URLSearchParams(location.search);
    const dateStr =
      queryParams.get("date") || new Date().toISOString().split("T")[0];

    setDateString(dateStr);

    listReservations({ date: dateStr }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const handleNext = () => {
    const queryParams = new URLSearchParams(location.search);
    const dateStr =
      queryParams.get("date") || new Date().toISOString().split("T")[0];

    const currentDate = new Date(dateStr);
    const nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    const formattedNextDate = nextDate.toISOString().split("T")[0];

    history.push(`/dashboard?date=${formattedNextDate}`);
  };

  const handlePrevious = () => {
    const queryParams = new URLSearchParams(location.search);
    const dateStr =
      queryParams.get("date") || new Date().toISOString().split("T")[0];

    const currentDate = new Date(dateStr);
    const previousDate = new Date(
      currentDate.setDate(currentDate.getDate() - 1)
    );
    const formattedPreviousDate = previousDate.toISOString().split("T")[0];

    history.push(`/dashboard?date=${formattedPreviousDate}`);
  };

  const handleToday = () => {
    const todayDate = today();
    history.push(`/dashboard?date=${todayDate}`);
  };

  useEffect(() => {
    console.log(reservations);
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {dateString}</h4>
      </div>
      <div>
        <button
          type="button"
          onClick={handlePrevious}
          className="btn btn btn-info"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleToday}
          className="btn btn btn-info m-2"
        >
          Today
        </button>
        <button type="button" onClick={handleNext} className="btn btn btn-info">
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <Reservations reservations={reservations} />
      <ErrorAlert error={tablesError} />
      <Tables tables={tables} onTableStatusChange={reloadDashboardData} />
    </main>
  );
}

export default Dashboard;
