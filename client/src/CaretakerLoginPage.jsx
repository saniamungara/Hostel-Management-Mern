import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const CaretakerLoginPage = () => {
    const [password, setPassword] = useState('');
    const [ctId, setctId] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/caretakerlogin`, { ctId, password })
            .then(result => {
                console.log(result.data);
                if (result.data === "success") {
                    localStorage.setItem('caretakerId', ctId);
                    navigate('/caretakerdashboard');
                } else if (result.data === "no_id") {
                    alert("No such ID in the database.");
                } else if (result.data === "wrong_password") {
                    alert("Incorrect password.");
                } else {
                    alert("Unexpected response from server.");
                }
            })
            .catch(err => {
                console.log(err);
                alert("An error occurred. Please try again later.");
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h3 className="text-center mb-4">Caretaker Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="ctId" className="form-label">
                            ID Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="ctId"
                            placeholder="Enter your ID number"
                            onChange={(e) => setctId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CaretakerLoginPage;
