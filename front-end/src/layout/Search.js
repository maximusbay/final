import React, { useState } from "react";
import { searchReservations } from "../utils/api";
import Reservations from "../dashboard/Reservations";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const abortController = new AbortController();
      
      const foundReservations = await searchReservations(mobileNumber, abortController.signal);
      setReservations(foundReservations || []);
      
      return () => abortController.abort();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Find Reservation</h1>
      <input
        name="mobile_number"
        placeholder="Enter a customer's phone number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Find</button>
      {isLoading && <p>Loading...</p>}
      <ErrorAlert error={error} />
      {reservations.length > 0 ? (
        <Reservations reservations={reservations} />
      ) : (
        !isLoading && <p>No reservations found</p>
      )}
    </div>
  );
}

export default Search;