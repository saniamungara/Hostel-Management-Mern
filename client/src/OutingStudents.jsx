import React, { useEffect, useState } from 'react';

const OutingStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/outingacceptedstudents`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStudents(data);
            } catch (err) {
                console.error('Error fetching outing requests:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return 'Invalid Date';
        }
    };

    const handleCheckIn = async (idNumber) => {
        setDeleteLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/outingacceptedstudents/${idNumber}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setStudents(students.filter(student => student.idNumber !== idNumber));
            setSuccess('Student checked in successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error checking in student:', err);
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Outing Accepted Students</h2>

            {success && (
                <div className="alert alert-success text-center">
                    {success}
                </div>
            )}

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2">Loading...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">
                    Error loading data: {error}
                </div>
            ) : students.length === 0 ? (
                <div className="alert alert-info text-center">No outing accepted</div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle text-center">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>#</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>ID Number</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Name</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Outing Time</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Reporting Time</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Student Phone</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Parent Phone</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Reason</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Submitted At</th>
                                    <th style={{ backgroundColor: '#EADDCA', color: '#6f4e37', fontWeight: 'bold' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student._id}>
                                        <td>{index + 1}</td>
                                        <td>{student.idNumber || 'N/A'}</td>
                                        <td>{student.name || 'N/A'}</td>
                                        <td>{formatDate(student.outingTime)}</td>
                                        <td>{formatDate(student.reportingTime)}</td>
                                        <td>{student.studentPhone || 'N/A'}</td>
                                        <td>{student.parentPhone || 'N/A'}</td>
                                        <td>{student.reason || 'N/A'}</td>
                                        <td>{formatDate(student.submittedAt)}</td>
                                        <td>
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleCheckIn(student.idNumber)}
                                                disabled={deleteLoading}
                                            >
                                                {deleteLoading ? 'Processing...' : 'IN'}
                                            </button>
                                        </td>
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

export default OutingStudents;
