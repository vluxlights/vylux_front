import styles from "./Checkout.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Helmet } from "react-helmet";
import { FaLock } from "react-icons/fa";
import BULB from "../../assests/Home_page/bulb.jpeg";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {

  const location = useLocation();
  const navigate = useNavigate();

  const cartData = location.state?.cart || [];
  const subtotal = location.state?.subtotal || 0;

  const token = localStorage.getItem("token");

  const [cart, setCart] = useState(cartData);

  const [settings, setSettings] = useState({
    gst: 18,
    deliveryFee: 50
  });

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });

  // ================= FETCH SETTINGS =================

  const fetchSettings = async () => {
    try {

      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/settings"
      );

      setSettings(res.data);

    } catch (err) {

      console.log(err);

    }
  };

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

      if (profile && profile.address) {

        setForm({
          name: profile.name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          state: profile.state || "",
          pincode: profile.pincode || "",
          landmark: profile.landmark || ""
        });

        setIsProfileLoaded(true);

      }

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchSettings();
    fetchProfile();

  }, []);

  const handleChange = (e) => {

    if (isProfileLoaded) return;

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ================= CALCULATIONS =================

  const gst = subtotal * (settings.gst / 100);

  const delivery = subtotal > 0
    ? settings.deliveryFee
    : 0;

  const total = subtotal + gst + delivery;

  // ================= UPDATE ADDRESS =================

  const handleUpdateAddress = () => {

    navigate("/profile");

  };

  // ================= WHATSAPP MESSAGE =================

  const buildMessage = () => {

    const products = cart.map((item, index) =>

      `${index + 1}. ${item.productId.name}
Qty: ${item.quantity}
Price: ₹${item.productId.price * item.quantity}`

    ).join("\n\n");

    return `🧾 ORDER CONFIRMATION

━━━━━━━━━━━━━━━━━━
📦 PRODUCTS
━━━━━━━━━━━━━━━━━━
${products}

━━━━━━━━━━━━━━━━━━
💰 BILL SUMMARY
━━━━━━━━━━━━━━━━━━
Subtotal : ₹${subtotal}
GST (${settings.gst}%): ₹${gst.toFixed(0)}
Delivery : ₹${delivery}
-------------------------
TOTAL    : ₹${total.toFixed(0)}

━━━━━━━━━━━━━━━━━━
👤 CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━
Name     : ${form.name}
Phone    : ${form.phone}
Address  : ${form.address}
City     : ${form.city}
State    : ${form.state}
Pincode  : ${form.pincode}
Landmark : ${form.landmark}

━━━━━━━━━━━━━━━━━━
Thank you for your order!`;

  };

  // ================= PLACE ORDER =================

  const handlePlaceOrder = async () => {

    try {

      if (
        !form.name.trim() ||
        !form.phone.trim() ||
        !form.address.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.pincode.trim()
      ) {

        alert("All fields are required");
        return;

      }

      if (!/^[0-9]{10}$/.test(form.phone)) {

        alert("Phone must be 10 digits");
        return;

      }

      if (!/^[0-9]{6}$/.test(form.pincode)) {

        alert("Pincode must be 6 digits");
        return;

      }

      await axios.post(
        "https://vlux-backend.onrender.com/api/vlux/order",
        {
          items: cart,
          address: form,
          subtotal,
          gst,
          delivery,
          total
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const message = buildMessage();

      const phoneNumber = "919790051137";

      const url =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");

      setCart([]);

      navigate("/success", { replace: true });

    } catch (err) {

      console.log(err);

      alert("Order failed");

    }

  };

  return (

    <>
      <div className={styles.cont}>

        <Helmet>
          <title>Checkout Page</title>
        </Helmet>

        <Header />

        <div className={styles.main}>

          {/* ================= LEFT ================= */}

          <div className={styles.left}>

            <h2 className={styles.lhead}>
              Checkout
            </h2>

            <div className={styles.lmain}>

              <div className={styles.title}>

                <FaLocationDot className={styles.loc} />

                <p>Delivery Details</p>

              </div>

              <div className={styles.formGrid}>

                <div className={styles.inputBox}>
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    readOnly={isProfileLoaded}
                    placeholder="Enter your name"
                  />
                </div>

                <div className={styles.inputBox}>
                  <label>Phone Number</label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    readOnly={isProfileLoaded}
                    placeholder="Enter phone number"
                  />
                </div>

              </div>

              <div className={styles.fullBox}>

                <label>Address</label>

                <textarea
                  rows="5"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  readOnly={isProfileLoaded}
                  placeholder="Enter full address"
                />

              </div>

              <div className={styles.formGrid}>

                <div className={styles.inputBox}>
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    readOnly={isProfileLoaded}
                    placeholder="City"
                  />
                </div>

                <div className={styles.inputBox}>
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    readOnly={isProfileLoaded}
                    placeholder="State"
                  />
                </div>

              </div>

              <div className={styles.formGrid}>

                <div className={styles.inputBox}>
                  <label>Pincode</label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    readOnly={isProfileLoaded}
                    placeholder="Pincode"
                  />
                </div>

                <div className={styles.inputBox}>
                  <label>Landmark</label>

                  <input
                    type="text"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    readOnly={isProfileLoaded}
                    placeholder="Landmark"
                  />
                </div>

              </div>

              <button
                className={styles.updateBtn}
                onClick={handleUpdateAddress}
              >
                Update Address
              </button>

            </div>

          </div>

          {/* ================= RIGHT ================= */}

          <div className={styles.right}>

            <h2 className={styles.rhead}>
              Order Summary
            </h2>

            <div className={styles.placepro}>

              {
                cart.map((item) => (

                  <div
                    className={styles.pros}
                    key={item.productId._id}
                  >

                    <img
                      src={
                        item.productId.images?.[0]?.url
                        || BULB
                      }
                      alt=""
                    />

                    <div className={styles.proscen}>

                      <p className={styles.proshead}>
                        {item.productId.name}
                      </p>

                      <p className={styles.proquant}>
                        Qty : {item.quantity}
                      </p>

                    </div>

                    <p className={styles.prosprice}>
                      ₹{item.productId.price * item.quantity}
                    </p>

                  </div>

                ))
              }

            </div>

            <div className={styles.bill}>

              <div className={styles.rsub}>
                <p>Subtotal</p>
                <p>₹{subtotal}</p>
              </div>

              <div className={styles.rsub}>
                <p>GST ({settings.gst}%)</p>
                <p>₹{gst.toFixed(0)}</p>
              </div>

              <div className={styles.rsub}>
                <p>Delivery</p>
                <p>₹{delivery}</p>
              </div>

              <div className={styles.total}>
                <p>Total Amount</p>
                <p>₹{total.toFixed(0)}</p>
              </div>

            </div>

            <button
              className={styles.checkout}
              onClick={handlePlaceOrder}
            >

              <FaLock />

              Place Your Order

            </button>

          </div>

        </div>

        <Footer />

      </div>
    </>

  );

}