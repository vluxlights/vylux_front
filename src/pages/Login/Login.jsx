import { useState, useEffect } from "react";
import Styles from "./Login.module.css";
import LoginImg from "../../assests/login_images/login.jpeg";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import LOGO from "../../assests/logo/web_logo.png";

export default function Login() {

  const navigate = useNavigate();

  // FORM STATE
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // PASSWORD SHOW/HIDE
  const [showPassword, setShowPassword] = useState(false);

  // AUTO LOGIN IF TOKEN EXISTS
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {

      if (role === "admin") {
        navigate("/adminhome");
      } else {
        navigate("/home");
      }

    }

  }, [navigate]);

  // INPUT CHANGE
  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  // LOGIN
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

      // SAVE LOGIN
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      alert("Login successful!");

      // REDIRECT
      if (role === "admin") {
        navigate("/adminhome");
      } else {
        navigate("/home");
      }

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data?.message || "Login failed"
      );

    }

  };

  return (

    <div className={Styles.cont}>

      {/* HEADER */}
      <div className={Styles.shopHeader}>

        <div className={Styles.left}>
          <img src={LOGO} className={Styles.logo} alt="logo" />
        </div>

        <div className={Styles.right}></div>

      </div>

      {/* MAIN */}
      <div className={Styles.main}>

        {/* LEFT SIDE */}
        <div className={Styles.leftside}>
          <img src={LoginImg} alt="login" />
        </div>

        {/* RIGHT SIDE */}
        <div className={Styles.rightside}>

          <h1>Login</h1>

          <p>Enter your details to continue</p>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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

              {/* TOGGLE */}
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

            {/* FORGOT PASSWORD */}
            <div className={Styles.forgot}>
              <Link to="/forgot">
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button type="submit">
              Login
            </button>

          </form>

          {/* REGISTER */}
          <p className={Styles.signupText}>

            Don’t have an account?{" "}

            <Link to="/register">
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>

  );
}