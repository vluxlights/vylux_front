import styles from "./AdminSidebar.module.css";

import {
  FaChartBar,
  FaHome,
  FaBoxOpen,
  FaEye,
  FaCog,
  FaShoppingBag
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {

  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/admindashboard",
      icon: <FaChartBar />
    },

    {
      name: "Home",
      path: "/adminhome",
      icon: <FaHome />
    },

    {
      name: "Products",
      path: "/adminproducts",
      icon: <FaBoxOpen />
    },

    {
      name: "View",
      path: "/adminviewproducts",
      icon: <FaEye />
    },

    {
      name: "Settings",
      path: "/adminsettings",
      icon: <FaCog />
    },

    {
      name: "Orders",
      path: "/adminorder",
      icon: <FaShoppingBag />
    }
  ];

  return (
    <>

      {/* DESKTOP SIDEBAR */}

      <div className={styles.sidebar}>

        {menu.map((item, index) => (

          <Link
            key={index}
            to={item.path}
            className={`${styles.menuCard} ${
              location.pathname === item.path
                ? styles.active
                : ""
            }`}
          >

            <div className={styles.icon}>
              {item.icon}
            </div>

            <p>{item.name}</p>

          </Link>

        ))}

      </div>

      {/* MOBILE BOTTOM NAV */}

      <div className={styles.mobileNav}>

        {menu.map((item, index) => (

          <Link
            key={index}
            to={item.path}
            className={`${styles.mobileCard} ${
              location.pathname === item.path
                ? styles.mobileActive
                : ""
            }`}
          >

            <div className={styles.mobileIcon}>
              {item.icon}
            </div>

            <span>{item.name}</span>

          </Link>

        ))}

      </div>

    </>
  );
}