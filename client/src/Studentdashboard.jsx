import React from "react";
import { Link } from "react-router-dom";

const Studentdashboard = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-brown shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/studentdashboard">
          RCE Hostel Management
        </Link>
        <ul className="navbar-nav d-flex flex-row justify-content-start flex-grow-1 mx-4 mb-0">
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/outing">
              Outing Requests
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/leave">
              Leave Requests
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/history">
              History
            </Link>
          </li>
        </ul>
        <div className="d-flex">
          <button
            className="btn btn-outline-light"
            onClick={() => {
              localStorage.removeItem('studentId');
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Studentdashboard;
