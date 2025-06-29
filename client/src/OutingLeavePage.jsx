import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function OutingLeavePage() {
  const navigate = useNavigate()

  const [activeButton, setActiveButton] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleOutingClick = () => {
    navigate('/outing');
  };

  const handleLeaveClick = () => {
    navigate('/leave');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">
                <i className="bi bi-door-open me-2"></i>
                Request Portal
              </h2>
            </div>
            
            <div className="card-body">
              <div className="d-grid gap-3">
                <button 
                  className={`btn btn-lg ${activeButton === 'outing' ? 'btn-success' : 'btn-outline-success'} d-flex align-items-center justify-content-center`}
                  onClick={handleOutingClick}
                >
                  <i className="bi bi-people-fill fs-3 me-2"></i>
                  <span>Outing</span>
                </button>
                
                <button 
                  className={`btn btn-lg ${activeButton === 'leave' ? 'btn-info' : 'btn-outline-info'} d-flex align-items-center justify-content-center`}
                  onClick={handleLeaveClick}
                >
                  <i className="bi bi-airplane fs-3 me-2"></i>
                  <span>Leave</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutingLeavePage;