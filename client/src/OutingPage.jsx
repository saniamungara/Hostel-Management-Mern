import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

const OutingPage = () => {
  const [studentId, setStudentId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    outingTime: '',
    reportingTime: '',
    studentPhone: '',
    parentPhone: '',
    reason: ''  
  });
  const navigate = useNavigate()


  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    if (storedId) {
      setStudentId(storedId);
    } else {
      alert("No student ID found. Please log in again.");
     
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const completeData = {
      idNumber: studentId,
      ...formData
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/submit-outing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeData)
      });
  
      if (response.status === 409) {
        const result = await response.json();
        alert(result.message);
      } else if (response.ok) {
        alert('Outing request submitted successfully!');
        setFormData({
          name: '',
          outingTime: '',
          reportingTime: '',
          studentPhone: '',
          parentPhone: '',
          reason: ''
        });
        navigate('/home')
      } else {
        const result = await response.json();
        alert('Failed to submit outing: ' + result.message);
      }
  
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header" style={{ backgroundColor: '#EADDCA', color: '#6f4e37' }}>
              <h3 className="text-center">Student Outing Request Form</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label"><strong>ID Number</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="outingTime" className="form-label">Outing Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="outingTime"
                    name="outingTime"
                    value={formData.outingTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="reportingTime" className="form-label">Reporting Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="reportingTime"
                    name="reportingTime"
                    value={formData.reportingTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="studentPhone" className="form-label">Student Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="studentPhone"
                    name="studentPhone"
                    value={formData.studentPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="parentPhone" className="form-label">Parent Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="parentPhone"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="reason" className="form-label">Reason for Outing</label>
                  <textarea
                    className="form-control"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn" style={{ backgroundColor: '#EADDCA', color: '#6f4e37' }}>
                    Submit Outing Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutingPage;
