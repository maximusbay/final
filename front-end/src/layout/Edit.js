import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateFullReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import Form from "./Form";

function Edit() {
  const [formData, setFormData] = useState({});
  const { reservation_id } = useParams();
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();

    readReservation(reservation_id, abortController.signal)
      .then(setFormData)
      .catch((error) => console.error("Error fetching data: ", error));

    return () => abortController.abort();
  }, [reservation_id]);

  const handleChange = ({ target }) => {
    const value =
      target.name === "people" ? Number(target.value) : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateFullReservation(reservation_id, formData);
      history.goBack();
    } catch (error) {
      setErrors(error.message);
    }
  };

  return (
    <div>
      <ErrorAlert error={errors} />
      <h1>Update Reservation</h1>
      <Form
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onCancel={() => history.goBack()}
      />
    </div>
  );
}

export default Edit;
