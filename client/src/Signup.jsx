import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [step, setStep] = useState(1); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [studentId, setStudentId] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
       
        if (emailValue.includes('@')) {
            const usernamePart = emailValue.split('@')[0];
            const id = usernamePart.substring(0, 12).toUpperCase();
            setStudentId(id);
        }
    };

    const handleSendOtp = (e) => {
        e.preventDefault();
        console.log("handleSendOtp triggered with:", { name, email, password });
        axios.post('http://localhost:3001/send-otp', { name, email, password })
            .then(result => {
                console.log("send-otp response:", result.data);
                if (result.data === "invalid") {
                    alert("Enter a valid RCE email");
                } else if (result.data === "otp_sent") {
                    setStep(2);
                } else {
                    alert("Unexpected response from server");
                }
            })
            .catch(err => {
                console.error("Error sending OTP:", err);
                alert("Failed to send OTP. Please try again later.");
            });
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        axios.post('http://localhost:3001/verify-otp', { email, otp: fullOtp })
        .then(result => {
            if (result.data === "verified") {
                localStorage.setItem("studentId", studentId); 
                navigate("/home");
            }
        })
        .catch(err => {
            if (err.response && err.response.data === "otp_invalid") {
                alert("Invalid OTP. Please try again.");
            } else if (err.response && err.response.data === "otp_expired") {
                alert("OTP expired. Please restart the registration.");
                setStep(1);
            }else if (err.response && err.response.data === "email_exists"){
                alert("Email already in Use")
            } else {
                console.log(err);
                alert("Something went wrong. Please try again.");
            }
        });
    };

    const handleOtpChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 3) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const photoUrl = studentId ? `https://raceonline.in/${studentId}` : null;

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-50 d-flex justify-content-center"> {/* Changed width to 75% and added flex */}
                <div className="w-100"> {/* Form container - full width */}
                    {step === 1 ? (
                        <>
                            <h2>Register</h2>
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-3">
                                    <label htmlFor="name"><strong>Name</strong></label>
                                    <input type="text" placeholder="Enter name" id="name" className="form-control rounded-0" onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email"><strong>Email</strong></label>
                                    <input 
                                        type="email" 
                                        placeholder="Enter email" 
                                        id="email" 
                                        className="form-control rounded-0" 
                                        onChange={handleEmailChange} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password"><strong>Password</strong></label>
                                    <input type="password" placeholder="Enter password" id="password" className="form-control rounded-0" onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-success w-100 rounded-0">Send OTP</button>
                            </form>
                            <p className="mt-2">Already have an account?</p>
                            <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Log In</Link>
                        </>
                    ) : (
                        <>
                            <h2>Enter OTP</h2>
                            <form onSubmit={handleVerifyOtp}>
                                <div className="d-flex justify-content-between mb-3">
                                    {[0, 1, 2, 3].map(i => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            maxLength="1"
                                            className="form-control text-center mx-1"
                                            style={{ width: '40px', fontSize: '24px' }}
                                            value={otp[i]}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                        />
                                    ))}
                                </div>
                                <button type="submit" className="btn btn-success w-100 rounded-0">Verify OTP</button>
                            </form>
                            <button onClick={() => setStep(1)} className="btn btn-link mt-2">Go Back</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Signup;
