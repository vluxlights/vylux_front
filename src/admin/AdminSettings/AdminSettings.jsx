import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminSettings.module.css";
import { Helmet } from "react-helmet";
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminSidebar from "../AdminHome/AdminSidebar";

export default function AdminSettings() {

  const [gst, setGst] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  const [bannerImage, setBannerImage] = useState("");

  const token = localStorage.getItem("token");

  // GET SETTINGS
  const fetchSettings = async () => {
    try {
      const res = await axios.get("https://vlux-backend.onrender.com/api/vlux/settings");

      setGst(res.data.gst || 0);
      setDeliveryFee(res.data.deliveryFee || 0);

      setContactPhone(res.data.contactPhone || "");
      setContactEmail(res.data.contactEmail || "");
      setContactAddress(res.data.contactAddress || "");

      setBannerImage(res.data.bannerImage || "");

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // UPLOAD IMAGE TO BACKEND (NOT CLOUDINARY DIRECT)
  const uploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "https://vlux-backend.onrender.com/api/vlux/upload/banner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBannerImage(res.data.url);

    } catch (err) {
      console.log(err);
    }
  };

  // SAVE SETTINGS
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "https://vlux-backend.onrender.com/api/vlux/settings",
        {
          gst,
          deliveryFee,
          contactPhone,
          contactEmail,
          contactAddress,
          bannerImage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Settings Updated");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.cont}>

      <Helmet>
        <title>Admin Settings</title>
      </Helmet>

      <AdminHeader />

      <div className={styles.main}>

        <div className={styles.left}>
          <AdminSidebar />
        </div>

        <div className={styles.right}>

          <h2 className={styles.title}>Settings</h2>

          <form className={styles.form} onSubmit={handleSave}>

            {/* TAX SETTINGS */}
            <div className={styles.card}>
              <h3>Tax Settings</h3>

              <label>GST (%)</label>
              <input
                type="number"
                value={gst}
                onChange={(e) => setGst(Number(e.target.value))}
              />

              <label>Delivery Fee (₹)</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
              />
            </div>

            {/* CONTACT SETTINGS */}
            <div className={styles.card}>
              <h3>Contact Settings</h3>

              <label>Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />

              <label>Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />

              <label>Address</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
              />
            </div>

            {/* BANNER UPLOAD */}
            <div className={styles.card}>
              <h3>Contact Us Page -- Banner Image</h3>

              {/* IMAGE PREVIEW */}
              {bannerImage && (
                <img
                  src={bannerImage}
                  alt="banner"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    marginBottom: "10px",
                    borderRadius: "8px"
                  }}
                />
              )}

              <input type="file" onChange={uploadImage} />
            </div>

            <button className={styles.btn} type="submit">
              Save Settings
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}