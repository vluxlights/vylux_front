import { useState } from "react";
import Styles from "./Register.module.css";
import RegisterImg from "../../assests/login_images/register.jpeg";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import LOGO from "../../assests/logo/web_logo.png";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  // 👁 password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleregister = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const phoneNumber = formData.phoneNumber.trim();

    if (!name || !email || !password || !phoneNumber) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await API.post("/register", {
        name,
        email,
        password,
        phoneNumber,
      });

      alert("Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
      });

      navigate("/");

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className={Styles.cont}>

      {/* HEADER */}
      <div className={Styles.shopHeader}>
        <div className={Styles.left}>
          <img src={LOGO} className={Styles.logo} />
        </div>
        <div className={Styles.right}></div>
      </div>

      {/* MAIN */}
      <div className={Styles.main}>
        <Leftside />
        <Rightside
          formData={formData}
          handleChange={handleChange}
          handleregister={handleregister}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />
      </div>

    </div>
  );
}

/* ---------------- LEFT SIDE ---------------- */
export function Leftside() {
  return (
    <div className={Styles.leftside}>
      <img src={RegisterImg} alt="register" />
    </div>
  );
}

/* ---------------- RIGHT SIDE ---------------- */
export function Rightside({
  formData,
  handleChange,
  handleregister,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) {
  return (
    <div className={Styles.rightside}>
      <h1>Create Account</h1>
      <p>Fill in the details to get started</p>

      <form onSubmit={handleregister}>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
        />

        {/* PASSWORD */}
        <label>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer"
            }}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <label>Confirm Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer"
            }}
          >
            {showConfirmPassword ? "🙈" : "👁"}
          </span>
        </div>

        <label>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter 10-digit phone number"
          maxLength={10}
        />

        <button type="submit">Create Account</button>
      </form>

      <p className={Styles.loginText}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}