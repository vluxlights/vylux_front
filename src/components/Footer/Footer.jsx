import styles from "./Footer.module.css";

import FooterBanner from "../../assests/Home_page/footer.jpeg";
import Logo from "../../assests/logo/web_logo.png";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Footer() {

  const [settings, setSettings] = useState({});

  // ================= FETCH SETTINGS =================

  const fetchSettings = async () => {

    try {

      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/settings"
      );

      setSettings(res.data || {});

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchSettings();

  }, []);

  return (
    <>

      {/* ================= TOP IMAGE ================= */}
         
         <div className={styles.cont}>

          
      <div className={styles.topBanner}>

        <img
          src={FooterBanner}
          alt="footer-banner"
          className={styles.bannerImage}
        />

      </div>

      {/* ================= FOOTER MAIN ================= */}

      <div className={styles.footerMain}>

        {/* ================= LOGO SECTION ================= */}

        <div className={styles.footerBox}>

          <img
            src={Logo}
            alt="logo"
            className={styles.logo}
          />

          <p className={styles.footerText}>
            High performance LED lighting
            solutions for every home,
            industry and outdoor spaces.
          </p>

          <div className={styles.socials}>

            {/* FACEBOOK */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <FaFacebookF />
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <FaInstagram />
            </a>

            {/* WHATSAPP */}
            <a
              href={`https://wa.me/91${settings.contactPhone || "917358433622"}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <FaWhatsapp />
            </a>

          </div>

        </div>

        {/* ================= BULK ORDER ================= */}

        <div className={styles.footerBox}>

          <h2>BULK ORDERS & DEALERSHIP</h2>

          <div className={styles.line}></div>

          <p className={styles.footerText}>
            We offer special pricing and dedicated
            support for bulk orders and dealers.
            Partner with VYLUX and grow together.
          </p>

          <Link
            to="/contactus"
            className={styles.contactLink}
          >

            <button className={styles.contactBtn}>

              <FaChevronRight />

              Get in touch for business inquiries

            </button>

          </Link>

        </div>

        {/* ================= LOCATION ================= */}

        <div className={styles.footerBox}>

          <h2>OUR LOCATION</h2>

          <div className={styles.line}></div>

          <div className={styles.infoRow}>

            <FaMapMarkerAlt className={styles.infoIcon} />

            <p className={styles.addressText}>

              {
                settings.contactAddress
                  ? settings.contactAddress
                      .split(",")
                      .map((item, index) => (
                        <span key={index}>
                          {item.trim()}
                          <br />
                        </span>
                      ))
                  : "Address Not Available"
              }

            </p>

          </div>

        </div>

        {/* ================= CONTACT ================= */}

        <div className={styles.footerBox}>

          <h2>CONTACT US</h2>

          <div className={styles.line}></div>

          <div className={styles.infoRow}>

            <FaPhoneAlt className={styles.infoIcon} />

            <p>
              {settings.contactPhone || "Phone Not Available"}
            </p>

          </div>

          <div className={styles.infoRow}>

            <FaEnvelope className={styles.infoIcon} />

            <p>
              {settings.contactEmail || "Email Not Available"}
            </p>

          </div>

          <div className={styles.infoRow}>

            <FaGlobe className={styles.infoIcon} />

            <p>
              www.vyluxlighting.com
            </p>

          </div>

        </div>

      </div>

      {/* ================= BOTTOM BAR ================= */}

      <div className={styles.bottomBar}>

        <div className={styles.secure}>

          <FaShieldAlt />

          <p>100% Secure Payments</p>

        </div>

        <p className={styles.copyRight}>
          © 2026 <span>VYLUX</span> Lighting. All Rights Reserved.
        </p>

      </div>
         </div>

    </>
  );
}