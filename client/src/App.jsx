import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import OutingPage from './OutingPage';
import LeavePage from './LeavePage';
import Navbar from './Navbar';
import Welcome from './Welcome';
import CaretakerLoginPage from './CaretakerLoginPage';
import Caretakerdashboard from './Caretakerdashboard';
import Studentdashboard from './Studentdashboard';
import RceHostelManagementDashboard from './RceHostelManagementDashboard';
import OutingRequests from './OutingRequests';
import OutingStudents from './OutingStudents';
import History from './History';
import LeaveRequests from './LeaveRequests';
import LeaveAcceptedStudents from './LeaveAcceptedStudents';
import './App.css';

function AppContent() {
  const location = useLocation();
  const studentRoutes = ['/outing', '/leave', '/history'];
  const caretakerRoutes = ['/caretakerdashboard', '/outingrequests', '/outingacceptedstudents', '/leaverequests', '/leavestudents'];
  const showStudentDashboard = studentRoutes.includes(location.pathname);
  const showCaretakerDashboard = caretakerRoutes.includes(location.pathname);

  return (
    <>
      {location.pathname === '/home' && <RceHostelManagementDashboard />}
      {showStudentDashboard && <Studentdashboard />}
      {showCaretakerDashboard && <Caretakerdashboard />}
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/outing" element={<OutingPage />} />
        <Route path="/leave" element={<LeavePage />} />
        <Route path='/' element={<Welcome />} />
        <Route path='/caretakerlogin' element={<CaretakerLoginPage />} />
        <Route path='/outingrequests' element={<OutingRequests />} />
        <Route path='/outingacceptedstudents' element={<OutingStudents />} />
        <Route path='/history' element={<History />} />
        <Route path='/leaverequests' element={<LeaveRequests />} />
        <Route path='/leavestudents' element={<LeaveAcceptedStudents />} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  const location = useLocation();
  const isBackgroundImageRoute = location.pathname.startsWith('/caretakerdashboard') || location.pathname.includes('studentdashboard');

  return (
    <div className={isBackgroundImageRoute ? 'app-content background-image' : 'app-content'}>
      <AppContent />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
