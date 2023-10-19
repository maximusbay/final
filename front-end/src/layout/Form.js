import React from "react";

function Form({ formData, handleChange, handleSubmit, onCancel }) {
  const phonePattern = /^[0-9-]*$/;

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    if (phonePattern.test(inputValue)) {
      handleChange(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          name="first_name"
          type="text"
          value={formData.first_name || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div>
        <label>Last Name</label>
        <input
          id="last_name"
          name="last_name"
          className="form-control"
          type="text"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Phone Number</label>
        <input
          id="mobile_number"
          name="mobile_number"
          className="form-control"
          type="text"
          value={formData.mobile_number}
          onChange={handlePhoneChange}
        />
      </div>
      <div>
        <label>Date</label>
        <input
          id="reservation_date"
          name="reservation_date"
          className="form-control"
          type="date"
          value={formData.reservation_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Time</label>
        <input
          id="reservation_time"
          name="reservation_time"
          className="form-control"
          type="time"
          value={formData.reservation_time}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>People</label>
        <input
          id="people"
          name="people"
          className="form-control"
          type="number"
          value={formData.people}
          onChange={handleChange}
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary m-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Form;
