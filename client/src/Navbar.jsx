import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaHistory, FaWalking, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-brown py-2 px-4">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/studentdashboard">RCE Hostel Management</Link>
        <ul className="navbar-nav d-flex flex-row justify-content-start flex-grow-1 ms-3 mb-0">
          <li className="nav-item mx-2">
            <Link 
              className={`nav-link ${location.pathname === '/outing' ? 'active' : ''}`} 
              to="/outing"
            >
              <FaWalking className="me-2" />
              Outing Approvals
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link 
              className={`nav-link ${location.pathname === '/leave' ? 'active' : ''}`} 
              to="/leave"
            >
              <FaInfoCircle className="me-2" />
              Leave Approvals
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link 
              className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`} 
              to="/history"
            >
              <FaHistory className="me-2" />
              HISTORY
            </Link>
          </li>
        </ul>
        <div>
          <button 
            className="btn btn-outline-light" 
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
