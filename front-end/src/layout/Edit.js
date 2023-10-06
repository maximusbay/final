import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateFullReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function Edit() {
    const [formData, setFormData] = useState({});
    const { reservation_id } = useParams();
    const [errors, setErrors] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();
        
        readReservation(reservation_id, abortController.signal)
            .then(setFormData)
            .catch(error => console.error("Error fetching data: ", error));
        
        return () => abortController.abort();
    }, [reservation_id]);

    const handleChange = ({ target }) => {
        const value = target.name === "people" ? Number(target.value) : target.value;
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
            <form onSubmit={handleSubmit}>
            <div>
            <label>First Name</label>
            <input 
                id="first_name"
                name="first_name" 
                className="form-control" 
                type="text" 
                value={formData.first_name} 
                onChange={handleChange}
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
                onChange={handleChange}
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
            <button className="btn btn-primary">Submit</button>
            <button className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
            </div>
            </form>
        </div>
    )
}

export default Edit