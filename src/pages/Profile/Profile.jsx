import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Profile.module.css";

import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaCreditCard,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function Profile() {

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    altPhone: "",
    landmark: ""
  });

  // ================= FETCH PROFILE =================

  const fetchProfile = async () => {

    try {

      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const profile = res.data.profile;
      const email = res.data.email;

      setUser({
        name: profile?.name || "",
        email: email || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        city: profile?.city || "",
        state: profile?.state || "",
        pincode: profile?.pincode || "",
        altPhone: profile?.altPhone || "",
        landmark: profile?.landmark || ""
      });

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchProfile();

  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value
    });

  };

  // ================= SAVE PROFILE =================

  const handleEditToggle = async () => {

    if (isEditing) {

      try {

        await axios.put(
          "https://vlux-backend.onrender.com/api/vlux/profile",
          {
            name: user.name,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            altPhone: user.altPhone,
            landmark: user.landmark
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Profile Updated");

        if (location.state?.from === "checkout") {

          navigate(-1);

        }

      } catch (err) {

        console.log(err);
        alert("Update failed");

      }

    }

    setIsEditing(!isEditing);

  };

  // ================= NAVIGATION =================

  const goToOrders = () => {

    navigate("/myorders");

  };

  const goToCart = () => {

    navigate("/cartpage");

  };

  const goToCheckout = () => {

    navigate("/checkout");

  };

  const goToHome = () => {

    navigate("/home");

  };

  const logout = () => {

    localStorage.removeItem("token");
    navigate("/login");

  };

  return (

    <>

      <Header />

      <div className={styles.container}>

        {/* ================= SIDEBAR ================= */}

        <div className={styles.sidebar}>

          <div
            className={styles.menu}
            onClick={goToHome}
          >
            <FaHome className={styles.icon} />
            <span>Home</span>
          </div>

          <div
            className={styles.menu}
            onClick={goToOrders}
          >
            <FaShoppingBag className={styles.icon} />
            <span>Orders</span>
          </div>

          <div
            className={styles.menu}
            onClick={goToCart}
          >
            <FaShoppingCart className={styles.icon} />
            <span>Cart</span>
          </div>

          <div
            className={styles.menu}
            onClick={goToCheckout}
          >
            <FaCreditCard className={styles.icon} />
            <span>Checkout</span>
          </div>

          <div className={styles.active}>
            <FaUser className={styles.icon} />
            <span>Profile</span>
          </div>

          <div
            className={styles.logout}
            onClick={logout}
          >
            <FaSignOutAlt className={styles.icon} />
            <span>Logout</span>
          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className={styles.content}>

          <h2>
            My Profile
          </h2>

          <div className={styles.form}>

            <div className={styles.field}>

              <label>Name</label>

              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                disabled={!isEditing}
              />

            </div>

            <div className={styles.field}>

              <label>Email</label>

              <input
                type="text"
                value={user.email}
                disabled
              />

            </div>

            <div className={styles.field}>

              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />

            </div>

            <div className={styles.field}>

              <label>Address</label>

              <textarea
  name="address"
  rows="4"
  value={user.address}
  onChange={handleChange}
  disabled={!isEditing}
/>

            </div>

            <div className={styles.field}>

              <label>City</label>

              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                disabled={!isEditing}
              />

            </div>

            <div className={styles.field}>

              <label>State</label>

              <input
                type="text"
                name="state"
                value={user.state}
                onChange={handleChange}
                disabled={!isEditing}
              />

            </div>

            <div className={styles.field}>

              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                value={user.pincode}
                onChange={handleChange}
                disabled={!isEditing}
              />

            </div>

            <div className={styles.field}>

              <label>Alternate Phone</label>

              <input
                type="text"
                name="altPhone"
                value={user.altPhone}
                onChange={handleChange}
                disabled={!isEditing}
              />

            </div>

            <div className={styles.field}>

              <label>Landmark</label>

              <input
                type="text"
                name="landmark"
                value={user.landmark}
                onChange={handleChange}
                disabled={!isEditing}
              />

            </div>

          </div>

          <button
            className={styles.editBtn}
            onClick={handleEditToggle}
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>

        </div>

      </div>

      <Footer />

    </>

  );

}