import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const RoleSelectionPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 bg-white rounded shadow text-center">
        <h1 className="mb-1">Ramachandra College of Engineering</h1>
        <h5 className="mb-4 text-muted">Hostel Management</h5>
        <h2 className="mb-5">Select Your Role</h2>
        <div className="d-flex gap-4 justify-content-center">
          <Link to="/caretakerlogin" className="btn btn-primary btn-lg d-flex align-items-center gap-2" style={{ minWidth: '140px', justifyContent: 'center' }}>
            <i className="bi bi-person-fill-gear"></i>
            Supervisor
          </Link>
          <Link to="/login" className="btn btn-success btn-lg d-flex align-items-center gap-2" style={{ minWidth: '140px', justifyContent: 'center' }}>
            <i className="bi bi-person-fill"></i>
            Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
