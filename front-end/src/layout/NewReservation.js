import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import Form from "./Form";

function NewReservation() {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(0);
  const [error, setError] = useState(null);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    console.log(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    console.log(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    console.log(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    console.log(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    console.log(e.target.value);
  };

  const handlePeopleChange = (e) => {
    setPeople(parseInt(e.target.value, 10) || 1);
    console.log(e.target.value);
  };

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
      .then(() => history.push(`/dashboard?date=${date}`))
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };
  const formData = {
    first_name: firstName,
    last_name: lastName,
    mobile_number: phoneNumber,
    reservation_date: date,
    reservation_time: time,
    people: people,
  };

  const handleChange = (e) => {
    const handlerMap = {
      first_name: handleFirstNameChange,
      last_name: handleLastNameChange,
      mobile_number: handlePhoneNumberChange,
      reservation_date: handleDateChange,
      reservation_time: handleTimeChange,
      people: handlePeopleChange,
    };
    handlerMap[e.target.name](e);
  };

  return (
    <div>
      <h2>Create reservation</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onCancel={() => history.goBack()}
      />
    </div>
  );
}

export default NewReservation;
