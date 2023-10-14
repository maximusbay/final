import React, { useState } from "react";
import { searchReservations } from "../utils/api";
import Reservations from "../dashboard/Reservations";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const abortController = new AbortController();

      const foundReservations = await searchReservations(
        mobileNumber,
        abortController.signal
      );
      setReservations(foundReservations || []);

      return () => abortController.abort();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
    return () => controller.abort();
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <h1>Find Reservation</h1>
        <input
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <button type="submit">Find</button>
        {isLoading && <p>Loading...</p>}
        <ErrorAlert error={error} />
        {reservations.length > 0 ? (
          <Reservations reservations={reservations} />
        ) : (
          !isLoading && <p>No reservations found</p>
        )}
      </form>
    </div>
  );
}

export default Search;
