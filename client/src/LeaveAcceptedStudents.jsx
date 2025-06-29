import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaveAcceptedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/leaveacceptedstudents')
      .then(response => response.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching accepted leave students:', error);
        setLoading(false);
      });
  }, []);

  const handleBackToRequests = () => {
    navigate('/leaverequests');
  };

  if (loading) return <div>Loading accepted leave students...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Leave Accepted Students</h2>
      {students.length === 0 ? (
        <div className="alert alert-info text-center">No accepted leave students found.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead style={{ backgroundColor: '#EADDCA', color: '#6f4e37' }}>
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
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.idNumber || 'N/A'}</td>
                    <td>{student.name || 'N/A'}</td>
                    <td>{new Date(student.leaveStart).toLocaleString()}</td>
                    <td>{new Date(student.leaveEnd).toLocaleString()}</td>
                    <td>{student.studentPhone || 'N/A'}</td>
                    <td>{student.parentPhone || 'N/A'}</td>
                    <td>{student.reason || 'N/A'}</td>
                    <td>{new Date(student.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaveAcceptedStudents;
