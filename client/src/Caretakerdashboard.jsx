import React from "react";
import { Link } from "react-router-dom";

const Caretakerdashboard = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-brown shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/caretakerdashboard">
          RCE Hostel Management
        </Link>
        <ul className="navbar-nav d-flex flex-row justify-content-between flex-grow-1 mx-4 mb-0">
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/outingrequests">
              Outing Approvals
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/leaverequests">
              Leave Approvals
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/outingacceptedstudents">
              Approved Outings
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/leavestudents">
              Approved Leaves
            </Link>
          </li>
        </ul>
        <div className="d-flex">
          <button
            className="btn btn-outline-light"
            onClick={() => {
              localStorage.removeItem('caretakerId');
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

export default Caretakerdashboard;
