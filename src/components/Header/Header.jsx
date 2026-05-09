import styles from "./Header.module.css";
import LOGO from "../../assests/logo/web_logo.png";

import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaPhoneAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {

  const [showNav, setShowNav] = useState(false);

  return (
    <>

      {/* ================= HEADER ================= */}

      <div className={styles.cont}>

        {/* LEFT MENU ICON */}
        <div>
          <FaBars
            className={styles.icon}
            onClick={() => setShowNav(true)}
          />
        </div>

        {/* LOGO */}
        <div>
          <img
            src={LOGO}
            alt="logo"
            className={styles.logo}
          />
        </div>

        {/* RIGHT ICONS */}
        <div className={styles.icons}>

          <Link to="/cartpage">
            <FaShoppingCart className={styles.cart} />
          </Link>

          <Link to="/profile">
            <FaUser className={styles.profile} />
          </Link>

        </div>

      </div>

      {/* ================= MOBILE SIDE NAV ================= */}

      {
        showNav && (
          <>
          
            {/* OVERLAY */}
            <div
              className={styles.overlay}
              onClick={() => setShowNav(false)}
            ></div>

            {/* SIDE NAV */}
            <div className={styles.navicont}>

              {/* CLOSE ICON */}
              <FaTimes
                className={styles.closeIcon}
                onClick={() => setShowNav(false)}
              />

              {/* LOGO */}
              <div className={styles.navLogoDiv}>
                <img
                  src={LOGO}
                  alt="logo"
                  className={styles.navLogo}
                />
              </div>

              {/* NAVIGATION */}
              <ul className={styles.navList}>

                <li>
                  <FaHome className={styles.navIcon} />

                  <Link
                    to="/home"
                    onClick={() => setShowNav(false)}
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <FaBoxOpen className={styles.navIcon} />

                  <Link
                    to="/products"
                    onClick={() => setShowNav(false)}
                  >
                    Products
                  </Link>
                </li>

                <li>
                  <FaClipboardList className={styles.navIcon} />

                  <Link
                    to="/myorders"
                    onClick={() => setShowNav(false)}
                  >
                    Orders
                  </Link>
                </li>

                <li>
                  <FaPhoneAlt className={styles.navIcon} />

                  <Link
                    to="/contactus"
                    onClick={() => setShowNav(false)}
                  >
                    Contact Us
                  </Link>
                </li>

              </ul>

            </div>

          </>
        )
      }

    </>
  );
}