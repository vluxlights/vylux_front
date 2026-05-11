import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Aboutus.module.css";
import BANNER from "../../assests/Home_page/banner.jpeg";

import { Helmet } from "react-helmet";

import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaLeaf,
  FaHeadphonesAlt,
  FaCheckCircle,
  FaUndoAlt
} from "react-icons/fa";

import { FaCrosshairs } from "react-icons/fa6";

export default function Aboutus() {

  const [settings, setSettings] = useState({});

  // ================= FORM =================

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });

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

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ================= WHATSAPP SEND =================

  const sendMessage = () => {

    const number = "9790051137";

    const text = `
Hello VYLUX,

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Subject: ${form.subject}
Message: ${form.message}
    `;

    const url =
      `https://wa.me/91${number}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");

  };

  return (

    <>

      <Helmet>
        <title>About Us</title>
      </Helmet>

      <div className={styles.cont}>

        <Header />

        {/* ================= BANNER ================= */}

        <div className={styles.banner}>

          <img
            src={settings.bannerImage || BANNER}
            alt="banner"
          />

        </div>

        {/* ================= MAIN ================= */}

        <div className={styles.main}>

          {/* ================= TITLE ================= */}

          <div className={styles.heading}>

            <p className={styles.smallTitle}>
              WHY CUSTOMERS TRUST US
            </p>

            <h2>

              WHY CHOOSE
              {" "}
              <span>VYLUX</span>

            </h2>

            <div className={styles.line}></div>

          </div>

          {/* ================= CARDS ================= */}

          <div className={styles.cards}>

            {/* CARD 1 */}

            <div className={styles.card}>

              <div className={styles.iconBox}>
                <FaShieldAlt className={styles.icon} />
              </div>

              <p className={styles.cardname}>
                PREMIUM QUALITY
              </p>

              <p className={styles.cardsub}>
                Best quality materials for
                long-lasting lighting performance.
              </p>

            </div>

            {/* CARD 2 */}

            <div className={styles.card}>

              <div className={styles.iconBox}>
                <FaLeaf className={styles.icon} />
              </div>

              <p className={styles.cardname}>
                ENERGY SAVING
              </p>

              <p className={styles.cardsub}>
                Advanced LED technology helps
                reduce electricity consumption.
              </p>

            </div>

            {/* CARD 3 */}

            <div className={styles.card}>

              <div className={styles.iconBox}>
                <FaCheckCircle className={styles.icon} />
              </div>

              <p className={styles.cardname}>
                LONG LIFE
              </p>

              <p className={styles.cardsub}>
                Durable products with consistent
                brightness for years.
              </p>

            </div>

            {/* CARD 4 */}

            <div className={styles.card}>

              <div className={styles.iconBox}>
                <FaCheckCircle className={styles.icon} />
              </div>

              <p className={styles.cardname}>
                WARRANTY SUPPORT
              </p>

              <p className={styles.cardsub}>
                Trusted warranty coverage for
                complete peace of mind.
              </p>

            </div>

            {/* CARD 5 */}

            <div className={styles.card}>

              <div className={styles.iconBox}>
                <FaHeadphonesAlt className={styles.icon} />
              </div>

              <p className={styles.cardname}>
                FAST SUPPORT
              </p>

              <p className={styles.cardsub}>
                Quick customer assistance through
                WhatsApp and phone support.
              </p>

            </div>

            {/* CARD 6 NEW */}

            <div className={styles.card}>

              <div className={styles.iconBox}>
                <FaUndoAlt className={styles.icon} />
              </div>

              <p className={styles.cardname}>
                EASY RETURNS
              </p>

              <p className={styles.cardsub}>
                Hassle-free replacement and return
                support for eligible products.
              </p>

            </div>

          </div>

          {/* ================= MISSION ================= */}

          <div className={styles.mission}>

            <div className={styles.faicon}>
              <FaCrosshairs className={styles.aicon} />
            </div>

            <div className={styles.mcont}>

              <p className={styles.mname}>
                OUR MISSION
              </p>

              <div className={styles.mhr}></div>

              <p className={styles.msub}>

                To provide affordable and
                high-quality lighting solutions
                that improve everyday life while
                saving energy and protecting
                the environment.

              </p>

            </div>

          </div>

          {/* ================= CONTACT ================= */}

          <div className={styles.touch}>

            {/* ================= LEFT ================= */}

            <div className={styles.ltouch}>

              <div className={styles.tcard}>

                <div className={styles.faWrap}>
                  <FaPhone className={styles.fa} />
                </div>

                <div>

                  <p className={styles.lhead}>
                    Phone / WhatsApp
                  </p>

                  <p className={styles.lsub}>
                    {settings.contactPhone || "Not Available"}
                  </p>

                </div>

              </div>

              <div className={styles.tcard}>

                <div className={styles.faWrap}>
                  <FaEnvelope className={styles.fa} />
                </div>

                <div>

                  <p className={styles.lhead}>
                    Email Address
                  </p>

                  <p className={styles.lsub}>
                    {settings.contactEmail || "Not Available"}
                  </p>

                </div>

              </div>

              <div className={styles.tcard}>

                <div className={styles.faWrap}>
                  <FaMapMarkerAlt className={styles.fa} />
                </div>

                <div>

                  <p className={styles.lhead}>
                    Shop Address
                  </p>

                  <p className={styles.lsub}>
                    {settings.contactAddress || "Not Available"}
                  </p>

                </div>

              </div>

              {/* ================= MAP ================= */}

              <div className={styles.map}>

                <iframe
                  title="shop-map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.438339680569!2d78.12792507399328!3d8.744761293375577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b03effe4f1e2c15%3A0xa09ab1fb615e3680!2sVVM%20COMPLEX.!5e0!3m2!1sen!2sin"
                  allowFullScreen
                  loading="lazy"
                />

              </div>

            </div>

            {/* ================= RIGHT ================= */}

            <div className={styles.rtouch}>

              <div className={styles.formTop}>

                <p className={styles.formSmall}>
                  CONTACT US
                </p>

                <h2>Get In Touch</h2>

              </div>

              {/* ROW */}

              <div className={styles.row}>

                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />

              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
              ></textarea>

              <button onClick={sendMessage}>
                Send Message
              </button>

            </div>

          </div>

        </div>

        <Footer />

      </div>

    </>

  );

}