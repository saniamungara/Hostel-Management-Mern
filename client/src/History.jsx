import React, { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
  const [outingCount, setOutingCount] = useState(0);
  const [currentOutings, setCurrentOutings] = useState([]);
  const [previousOutings, setPreviousOutings] = useState([]);
  const [currentLeaves, setCurrentLeaves] = useState([]);
  const [previousLeaves, setPreviousLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentEmail, setStudentEmail] = useState('');

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          setError('Student ID not found. Please log in.');
          setLoading(false);
          return;
        }

        const email = `${studentId.toLowerCase()}@rcee.ac.in`;
        setStudentEmail(email);
        const recordsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/student/outing-records?idNumber=${studentId}`);
        const currentOutingsData = recordsResponse.data.currentOutings || [];
        const previousOutingsData = recordsResponse.data.previousOutings || [];
        const now = new Date();
        const allOutings = [...currentOutingsData, ...previousOutingsData];
        const pastOutingsCount = allOutings.filter(outing => new Date(outing.outingTime) < now).length;
        setOutingCount(pastOutingsCount);
        setCurrentOutings(currentOutingsData);
        setPreviousOutings(previousOutingsData);
        const leaveResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/student/leave-records?idNumber=${studentId}`);
        setCurrentLeaves(leaveResponse.data.currentLeaves || []);
        setPreviousLeaves(leaveResponse.data.previousLeaves || []);

      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong> {error}
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Outing and Leave History</h2>
      <div className="mb-3 text-center">
        <small className="text-muted">Registered email: {studentEmail}</small>
      </div>

      <section className="mb-5">
        <h3>Outing History</h3>
        {/* Removed Total Outings Taken display */}
        {/* <p>Total Outings Taken: {outingCount}</p> */}

        <h4>Current Outing Requests</h4>
        {currentOutings.length === 0 ? (
          <p>No current outing requests.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
        {currentOutings.map((outing) => {
          const submittedDate = new Date(outing.submittedAt);
          const validSubmittedDate = isNaN(submittedDate) ? 'Invalid date' : submittedDate.toLocaleString();
          return (
            <div key={outing._id} className="card p-3 shadow-sm">
              <p><strong>Reason:</strong> {outing.reason}</p>
              <p><strong>Outing Time:</strong> {new Date(outing.outingTime).toLocaleString()}</p>
              <p><strong>Reporting Time:</strong> {new Date(outing.reportingTime).toLocaleString()}</p>
              <p><strong>Submitted At:</strong> {validSubmittedDate}</p>
            </div>
          );
        })}
          </div>
        )}



        <h4 className="mt-4">Previous Outings</h4>
        {previousOutings.length === 0 ? (
          <p>No previous outings found.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
        {previousOutings.map((outing) => {
          const submittedDate = new Date(outing.submittedAt);
          const validSubmittedDate = isNaN(submittedDate) ? 'Invalid date' : submittedDate.toLocaleString();
          return (
            <div key={outing._id} className="card p-3 shadow-sm">
              <p><strong>Reason:</strong> {outing.reason}</p>
              <p><strong>Outing Time:</strong> {new Date(outing.outingTime).toLocaleString()}</p>
              <p><strong>Reporting Time:</strong> {new Date(outing.reportingTime).toLocaleString()}</p>
              <p><strong>Submitted At:</strong> {validSubmittedDate}</p>
            </div>
          );
        })}
          </div>
        )}
      </section>

      <section>
        <h3>Leave History</h3>

        <h4>Current Leave Requests</h4>
        {currentLeaves.length === 0 ? (
          <p>No current leave requests.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {currentLeaves.map((leave) => {
              const leaveStartDate = new Date(leave.leaveStart);
              const leaveEndDate = new Date(leave.leaveEnd);
              const submittedDate = new Date(leave.submittedAt);
              const validLeaveStart = isNaN(leaveStartDate) ? 'Invalid date' : leaveStartDate.toLocaleString();
              const validLeaveEnd = isNaN(leaveEndDate) ? 'Invalid date' : leaveEndDate.toLocaleString();
              const validSubmittedDate = isNaN(submittedDate) ? 'Invalid date' : submittedDate.toLocaleString();
              return (
                <div key={leave._id} className="card p-3 shadow-sm">
                  <p><strong>Name:</strong> {leave.name}</p>
                  <p><strong>Leave Start:</strong> {validLeaveStart}</p>
                  <p><strong>Leave End:</strong> {validLeaveEnd}</p>
                  <p><strong>Student Phone:</strong> {leave.studentPhone}</p>
                  <p><strong>Parent Phone:</strong> {leave.parentPhone}</p>
                  <p><strong>Reason:</strong> {leave.reason}</p>
                  <p><strong>Submitted At:</strong> {validSubmittedDate}</p>
                </div>
              );
            })}
          </div>
        )}

        <h4 className="mt-4">Previous Leave Requests</h4>
        {previousLeaves.length === 0 ? (
          <p>No previous leave requests found.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {previousLeaves.map((leave) => {
              const leaveStartDate = new Date(leave.leaveStart);
              const leaveEndDate = new Date(leave.leaveEnd);
              const submittedDate = new Date(leave.submittedAt);
              const validLeaveStart = isNaN(leaveStartDate) ? 'Invalid date' : leaveStartDate.toLocaleString();
              const validLeaveEnd = isNaN(leaveEndDate) ? 'Invalid date' : leaveEndDate.toLocaleString();
              const validSubmittedDate = isNaN(submittedDate) ? 'Invalid date' : submittedDate.toLocaleString();
              return (
                <div key={leave._id} className="card p-3 shadow-sm">
                  <p><strong>Name:</strong> {leave.name}</p>
                  <p><strong>Leave Start:</strong> {validLeaveStart}</p>
                  <p><strong>Leave End:</strong> {validLeaveEnd}</p>
                  <p><strong>Student Phone:</strong> {leave.studentPhone}</p>
                  <p><strong>Parent Phone:</strong> {leave.parentPhone}</p>
                  <p><strong>Reason:</strong> {leave.reason}</p>
                  <p><strong>Submitted At:</strong> {validSubmittedDate}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
export default History;
