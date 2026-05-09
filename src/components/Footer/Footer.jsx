import styles from "./Footer.module.css";
import FooterImg from "../../assests/Home_page/foooter.jpeg";

import {
  FaTags,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

import { Link } from "react-router-dom";

export default function Footer() {

  return (
    <>

      {/* ================= FOOTER ================= */}

      <div className={styles.footerContainer}>

        {/* IMAGE */}
        <img
          src={FooterImg}
          alt="footer"
          className={styles.footerImage}
        />

        {/* OVERLAY CONTENT */}
        <div className={styles.overlayContent}>

          {/* LEFT CONTENT */}
          <div className={styles.leftContent}>

            <h1 className={styles.heading}>
              Looking for <span>Bulk Orders</span>
              <br />
              or <span>Dealership?</span>
            </h1>

            <p className={styles.desc}>
              Join hands with VYLUX and grow your business
              with premium quality lighting products.
            </p>

            {/* FEATURES */}
            <div className={styles.features}>

              <div className={styles.featureBox}>
                <FaTags className={styles.featureIcon} />
                <p>Best Prices</p>
              </div>

              <div className={styles.featureBox}>
                <FaTruck className={styles.featureIcon} />
                <p>Fast Delivery</p>
              </div>

              <div className={styles.featureBox}>
                <FaShieldAlt className={styles.featureIcon} />
                <p>Quality Products</p>
              </div>

              <div className={styles.featureBox}>
                <FaHeadset className={styles.featureIcon} />
                <p>24/7 Support</p>
              </div>

            </div>

          </div>

          {/* BUTTON */}
          <div className={styles.buttonDiv}>

            <Link to="/contactus">
              <button className={styles.contactBtn}>
                Contact Us
              </button>
            </Link>

          </div>

        </div>

      </div>

      {/* ================= COPYRIGHT ================= */}

      <div className={styles.copyDiv}>
        <p>
          © 2026 VYLUX Lighting. All Rights Reserved.
        </p>
      </div>

    </>
  );
}