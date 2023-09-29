import React from "react"
import { useHistory } from "react-router-dom"

function Reservations({ reservations }) {
    const history = useHistory()
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
                    {reservations.map(({
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
                                        <button 
                                            className="btn btn-info" 
                                            onClick={() => history.push(`/reservations/${reservation_id}/seat`)}
                                        >
                                            Seat
                                        </button>
                                    )}
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