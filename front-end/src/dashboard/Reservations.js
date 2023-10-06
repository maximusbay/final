import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { updateReservationStatus } from "../utils/api"

function Reservations({ reservations }) {
    const [updatedReservations, setUpdatedReservations] = useState(reservations);
   

    useEffect(() => {
        setUpdatedReservations(reservations);
      }, [reservations]);
  
      function handleCancel(reservationId) {
          if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
              updateReservationStatus(reservationId, "cancelled")
                  .then(() => {
                      setUpdatedReservations(updatedReservations.map(reservation => {
                          if(reservation.reservation_id === reservationId) {
                              reservation.status = "cancelled";
                          }
                          return reservation;
                      }));
                  })
                  .catch((error) => {
                      console.error(error);
                  });
          }
      }
  
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Reservation Time</th>
                        <th>People</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                {updatedReservations
    .map(({
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_time,
        people,
        status,
    }) => {
        return (
            <tr key={reservation_id}>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{mobile_number}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
                <td>
                {status === "booked" && (
                    <Link to={`/reservations/${reservation_id}/seat`}>
                        <button className="btn btn-info">
                         Seat
                        </button>
                    </Link>
                )}
                </td>
                <td>
                    <Link to={`/reservations/${reservation_id}/edit`}>
                     <button className="btn btn-warning">
                        Edit
                    </button>
                    </Link>
                </td>
                <td>
                <button 
                    className="btn btn-danger" 
                    onClick={() => handleCancel(reservation_id)}
                >Cancel
                </button>
                </td>
            </tr>
        )
    })}
                </tbody>
            </table>
        </div>
    )
}

export default Reservations