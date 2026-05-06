import styles from "./Header.module.css";
import LOGO from "../../assests/logo/web_logo.png";

import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";

export default function Header() {
  return (
    <div className={styles.cont}>

      {/* LOGO (TOP) */}
      <div className={styles.logo}>
        <img src={LOGO} alt="logo" />
      </div>

      {/* NAV + ICONS SAME ROW */}
      <div className={styles.navRow}>

        {/* NAVIGATION */}
        <ul className={styles.navList}>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/myorders">Orders</Link></li>
          <li><Link to="/contactus">Contact</Link></li>
        </ul>

        {/* ICONS */}
        <div className={styles.icons}>
          <Link to="/cartpage">
            <FaShoppingCart className={styles.cart} />
          </Link>

          <Link to="/profile">
            <FaUser className={styles.profile} />
          </Link>
        </div>

      </div>

    </div>
  );
}