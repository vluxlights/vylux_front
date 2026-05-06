import { useState } from "react";
import Styles from "./Login.module.css";
import LoginImg from "../../assests/login_images/login.jpeg";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import LOGO from "../../assests/logo/web_logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // 👁 password toggle state
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/login", {
        email,
        password
      });

      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      alert("Login successful!");

      if (role === "admin") {
        navigate("/adminhome");
      } else {
        navigate("/home");
      }

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
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
          handleLogin={handleLogin}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>

    </div>
  );
}

/* ---------------- LEFT SIDE ---------------- */
export function Leftside() {
  return (
    <div className={Styles.leftside}>
      <img src={LoginImg} alt="login" />
    </div>
  );
}

/* ---------------- RIGHT SIDE ---------------- */
export function Rightside({
  formData,
  handleChange,
  handleLogin,
  showPassword,
  setShowPassword
}) {
  return (
    <div className={Styles.rightside}>
      <h1>Login</h1>
      <p>Enter your details to continue</p>

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <label>Password</label>

        {/* PASSWORD INPUT + TOGGLE */}
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
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <div className={Styles.forgot}>
          <Link to="/forgot">Forgot Password?</Link>
        </div>

        <button type="submit">Login</button>
      </form>

      <p className={Styles.signupText}>
        Don’t have an account?{" "}
        <Link to="/register">Create Account</Link>
      </p>
    </div>
  );
}