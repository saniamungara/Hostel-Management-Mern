import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaveRequests = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState({}); 
  const [showLeaveStudentsButton, setShowLeaveStudentsButton] = useState(false);
  const navigate = useNavigate();
  const caretakerId = localStorage.getItem("caretakerId");

  useEffect(() => {
    console.log('Fetching leave requests with caretakerId:', caretakerId);
    let url = `${import.meta.env.VITE_API_BASE_URL}/leaverequestedstudents`;
    if (caretakerId && caretakerId !== 'null') {
      url += `?caretakerId=${caretakerId}`;
    }
    console.log('Fetch URL:', url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Leave requests data received:', data);
        setStudents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leave requests:', error);
        setLoading(false);
      });
  }, []);

  const handleDecision = (id, decision) => {
    setDecisions(prev => ({ ...prev, [id]: decision }));
  };

  const handleFinalSubmit = async () => {
    const payload = students.map(student => ({
      idNumber: student.idNumber,
      email: `${student.idNumber.toLowerCase()}@rguktn.ac.in`,
      decision: decisions[student._id],
      caretakerId: caretakerId,
      decisionDetails: "Your custom decision details here"
    }));

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/send-leave-mails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    alert(result.message || "All mails sent successfully");
    setShowLeaveStudentsButton(true);

    // Refresh the leave requests list after approval
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/leaverequestedstudents?caretakerId=${caretakerId}`)
      .then(response => response.json())
      .then(data => {
        setStudents(data);
        setDecisions({});
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leave requests:', error);
        setLoading(false);
      });
  };

  const handleLeaveStudentsList = () => {
    navigate('/leavestudents');
  };

  const allDecided = students.length > 0 && students.every(s => decisions[s._id]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Leave Requested Students</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="alert alert-info text-center">No leave requests found.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead>
                <tr>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>#</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>ID Number</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Name</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Leave Start</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Leave End</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Student Phone</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Parent Phone</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Reason</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Submitted At</th>
                  <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const status = decisions[student._id];
                  return (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>{student.idNumber}</td>
                      <td>{student.name}</td>
                      <td>{new Date(student.leaveStart).toLocaleString()}</td>
                      <td>{new Date(student.leaveEnd).toLocaleString()}</td>
                      <td>{student.studentPhone}</td>
                      <td>{student.parentPhone}</td>
                      <td>{student.reason}</td>
                      <td>{new Date(student.submittedAt).toLocaleString()}</td>
                      <td>
                        {status === 'Accepted' ? (
                          <button className="btn btn-success btn-sm" disabled>Accepted</button>
                        ) : status === 'Rejected' ? (
                          <button className="btn btn-danger btn-sm" disabled>Rejected</button>
                        ) : (
                          <>
                            <button
                              className="btn btn-success btn-sm me-1"
                              onClick={() => handleDecision(student._id, 'Accepted')}
                            >Accept</button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDecision(student._id, 'Rejected')}
                            >Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {allDecided && (
            <div className="text-center mt-4">
              <button 
                className="btn btn-brown me-2"
                onClick={handleFinalSubmit}
              >
                All Leaves are Decided
              </button>
              
              {showLeaveStudentsButton && (
                <button 
                  className="btn btn-brown"
                  onClick={handleLeaveStudentsList}
                >
                  Leave Students
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaveRequests;
