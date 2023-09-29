import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import { createReservation } from "../utils/api";

function NewReservation() {
    const history = useHistory()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [people, setPeople] = useState(0)
    const [error, setError] = useState(null);
  
    const handleFirstNameChange = (e) => {
      setFirstName(e.target.value)
      console.log(e.target.value)
    }
  
    const handleLastNameChange = (e) => {
      setLastName(e.target.value)
      console.log(e.target.value)
    }
  
    const handlePhoneNumberChange = (e) => {
      setPhoneNumber(e.target.value)
      console.log(e.target.value)
    }
  
    const handleDateChange = (e) => {
      setDate(e.target.value)
      console.log(e.target.value)
    }
  
    const handleTimeChange = (e) => {
      setTime(e.target.value)
      console.log(e.target.value)
    }
    
    const handlePeopleChange = (e) => {
      setPeople(parseInt(e.target.value, 10) || 1);
      console.log(e.target.value);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      setError(null);
      
      createReservation({
          first_name: firstName,
          last_name: lastName,
          mobile_number: phoneNumber,
          reservation_date: date,
          reservation_time: time,
          people: people,
      })
      .then(() => history.push(`/dashboard`))
      .catch((error) => {
        console.error(error); // This will log the entire error object to the console
        setError(error.message); // This assumes the error object has a message property
    });
  }
  
    return (
      <div>
        <h2>Create a reservation</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
        <div>
        <label for="first_name">First Name</label>
        <input name="first_name"  type="text" onChange={handleFirstNameChange} className="form-control"/>
        </div>
  
        <div>
        <label for="last_name">Last Name</label>
        <input name="last_name" type="text" onChange={handleLastNameChange} className="form-control"/>
        </div>
  
        <div>
        <label for="mobile_number">Phone Number</label>
        <input name="mobile_number" type="text" onChange={handlePhoneNumberChange} className="form-control"/>
        </div>
  
        <div>
        <label for="reservation_date">Date</label>
        <input name="reservation_date" type="date" onChange={handleDateChange} className="form-control"/>
        </div>
  
        <div>
        <label for="reservation_time">Time</label>
        <input name="reservation_time" type="time" onChange={handleTimeChange} className="form-control"/>
        </div>

        <div className="form-group">
          <label for="people">People</label>
          <input name="people" type="number" onChange={handlePeopleChange} className="form-control"/>
        </div>

        <div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" onClick={() => history.push("/dashboard")} className="btn btn-secondary m-2">Cancel</button>
        </div>
        </form>
      </div>
    )
  }

  export default NewReservation