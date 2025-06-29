import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (emailValue.includes('@')) {
      const usernamePart = emailValue.split('@')[0];
      const id = usernamePart.substring(0, 12).toUpperCase();
      console.log("Extracted student ID:", id, "Length:", id.length);
      setStudentId(id);
    } else {
      setStudentId('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.endsWith('@rcee.ac.in')) {
      alert("Please enter a valid RCE email address.");
      return;
    }

    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        console.log(result.data);
        if (result.data.status === "success") {
          console.log('CaretakerId from backend:', result.data.caretakerId);
      
          localStorage.setItem("studentId", studentId);
          if (result.data.caretakerId) {
            localStorage.setItem("caretakerId", result.data.caretakerId);
          } else {
            localStorage.setItem("caretakerId", "adminCaretakerId123");
          }

          navigate('/home');
        } else if (result.data === "no_email") {
          alert("No such email in the database.");
        } else if (result.data === "wrong_password") {
          alert("Incorrect password.");
        } else {
          alert("Unexpected response from server.");
        }
      })
      .catch(err => {
        console.log(err);
        alert("An error occurred. Please try again later.");
      });
  };

  const handleForgotPassword = () => {
    if (!email) {
        alert("Please enter your registered RCE email");
        return;
    }
    
    if (!email.endsWith('@rcee.ac.in')) {
        alert("Please enter a valid RCE email address");
        return;
    }

    if (window.confirm(`Send password reset OTP to ${email}?`)) {
        axios.post('http://localhost:3001/sendotp', { email })
            .then(response => {
                if (response.data.success) {
                    setOtpSent(true);
                    setShowForgotPassword(true);
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert(err.response?.data?.message || 
                     "An error occurred. Please try again.");
            });
    }
};
  const verifyOtp = () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    
    axios.post('http://localhost:3001/verifyotp', { email, otp })
      .then(response => {
        if (response.data.success) {
          setVerified(true);
          alert("OTP verified successfully. You can now set a new password.");
        } else {
          alert("Invalid OTP. Please try again.");
        }
      })
      .catch(err => {
        console.log(err);
        alert("An error occurred while verifying OTP");
      });
  };

  const updatePassword = () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    axios.post('http://localhost:3001/update-password', { email, newPassword })
      .then(response => {
        if (response.data.success) {
          alert("Password updated successfully. You can now login with your new password.");
          setShowForgotPassword(false);
          setOtpSent(false);
          setVerified(false);
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          alert("Failed to update password. Please try again.");
        }
      })
      .catch(err => {
        console.log(err);
        alert("An error occurred while updating password");
      });
  };

  const photoUrl = studentId ? `https://raceonline.in/${studentId}` : null;

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-50 d-flex justify-content-center">
        {/* Form container - full width */}
        <div className="w-100">
          <h2>Login</h2>
          {!showForgotPassword ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email"><strong>Email</strong></label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    id="email"
                    className="form-control rounded-0"
                    onChange={handleEmailChange}
                    value={email}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password"><strong>Password</strong></label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    id="password"
                    className="form-control rounded-0"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-0">
                  Login
                </button>
              </form>
              <button 
                onClick={handleForgotPassword}
                className="btn btn-link text-decoration-none p-0 mt-2"
              >
                Forgot Password?
              </button>
              <p className="mt-2">Don't have an account?</p>
              <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                Register
              </Link>
            </>
          ) : (
            <div className="forgot-password-form">
              <h4>Reset Password</h4>
              <p>Enter the OTP sent to {email}</p>
              
              {!verified ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="otp"><strong>OTP</strong></label>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      name="otp"
                      id="otp"
                      className="form-control rounded-0"
                      onChange={(e) => setOtp(e.target.value)}
                      value={otp}
                    />
                  </div>
                  <button 
                    onClick={verifyOtp}
                    className="btn btn-primary w-100 rounded-0 mb-2"
                  >
                    Verify OTP
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label htmlFor="newPassword"><strong>New Password</strong></label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      name="newPassword"
                      id="newPassword"
                      className="form-control rounded-0"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword"><strong>Confirm Password</strong></label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="form-control rounded-0"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                    />
                  </div>
                  <button 
                    onClick={updatePassword}
                    className="btn btn-success w-100 rounded-0 mb-2"
                  >
                    Update Password
                  </button>
                </>
              )}
              
              <button 
                onClick={() => {
                  setShowForgotPassword(false);
                  setOtpSent(false);
                  setVerified(false);
                }}
                className="btn btn-outline-secondary w-100 rounded-0"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;