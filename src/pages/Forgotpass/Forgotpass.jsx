import { useState } from "react";
import Styles from "./Forgotpass.module.css";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import LOGO from "../../assests/logo/web_logo.png";
import LoginImg from "../../assests/login_images/login.jpeg";

export default function Forgotpass() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================
     STEP 1 - SEND OTP
  ========================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      alert("Enter your email");
      return;
    }

    try {
      setLoading(true);

      await API.post("/forgot-password", {
        email: formData.email,
      });

      alert("✅ OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert(err?.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STEP 2 - RESET PASSWORD
  ========================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const { email, otp, newPassword } = formData;

    if (!otp || !newPassword) {
      alert("Fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await API.post("/reset-password", {
        email,
        otp,
        newPassword,
      });

      alert("✅ Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.container}>
      
      {/* HEADER */}
      <div className={Styles.header}>
        <img src={LOGO} alt="logo" />
      </div>

      {/* MAIN */}
      <div className={Styles.main}>
        
        {/* LEFT IMAGE */}
        <div className={Styles.left}>
          <img src={LoginImg} alt="forgot" />
        </div>

        {/* RIGHT FORM */}
        <div className={Styles.right}>
          <h1>Forgot Password</h1>

          {step === 1 ? (
            <>
              <p>Enter your email to receive OTP</p>

              <form onSubmit={handleSendOtp}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p>Enter OTP and new password</p>

              <form onSubmit={handleResetPassword}>
                <label>OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                />

                <label>New Password</label>

                <div className={Styles.passwordWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />

                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "🙈" : "👁"}
                  </span>
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          <p className={Styles.back}>
            <Link to="/login">← Back to Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
}