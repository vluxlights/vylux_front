import styles from "./AdminHeader.module.css";

import { FaUserShield, FaUser } from "react-icons/fa";

import { Link } from "react-router-dom";

export default function AdminHeader() {

  return (
    <>

      <div className={styles.header}>

        {/* LEFT */}

        <div className={styles.logoSection}>

          <h2>VLUX</h2>

          <p>Admin Panel</p>

        </div>

        {/* RIGHT */}

        <div className={styles.menuSection}>

          {/* ADMIN */}

          <div className={styles.menuCard}>

            <FaUserShield className={styles.icon} />

            <span>Admin</span>

          </div>

          {/* USER */}

          <Link
            to="/Home"
            target="_blank"
            className={styles.link}
          >

            <div className={styles.menuCard}>

              <FaUser className={styles.icon} />

              <span>User</span>

            </div>

          </Link>

        </div>

      </div>

    </>
  );
}