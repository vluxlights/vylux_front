import styles from "./Cart.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Helmet } from "react-helmet";
import { FaLock } from "react-icons/fa";
import BULB from "../../assests/Home_page/bulb.jpeg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [settings, setSettings] = useState({
    gst: 18,
    deliveryFee: 50
  });

  const token = localStorage.getItem("token");

  // ================= SETTINGS =================

  const fetchSettings = async () => {

    try {

      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/settings"
      );

      setSettings(
        res.data || {
          gst: 18,
          deliveryFee: 50
        }
      );

    } catch (err) {

      console.log(err);

    }

  };

  // ================= CART =================

  const fetchCart = async () => {

    try {

      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const items =
        res.data?.items ||
        res.data?.cart ||
        [];

      setCart(items);

    } catch (err) {

      console.log(err);

      setCart([]);

    }

  };

  useEffect(() => {

    fetchCart();
    fetchSettings();

  }, []);

  // ================= UPDATE QTY =================

  const updateQty = async (productId, type) => {

    try {

      await axios.put(
        "https://vlux-backend.onrender.com/api/vlux/cart/update",
        {
          productId,
          type
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchCart();

    } catch (err) {

      console.log(err);

    }

  };

  // ================= REMOVE =================

  const removeItem = async (productId) => {

    try {

      await axios.delete(
        `https://vlux-backend.onrender.com/api/vlux/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchCart();

    } catch (err) {

      console.log(err);

    }

  };

  // ================= CALCULATIONS =================

  const subtotal = cart.reduce((acc, item) => {

    const price = item?.productId?.price || 0;

    const qty = item?.quantity || 0;

    return acc + price * qty;

  }, 0);

  const gst =
    subtotal * ((settings?.gst || 0) / 100);

  const delivery =
    settings?.deliveryFee || 0;

  const total =
    subtotal + gst + delivery;

  return (

    <>

      <Helmet>
        <title>Cart Page</title>
      </Helmet>

      <div className={styles.cont}>

        <Header />

        <div className={styles.main}>

          {/* ================= LEFT ================= */}

          <div className={styles.left}>

            <h2 className={styles.lhead}>

              My Cart ({cart.length})

            </h2>

            {

              cart.length === 0

              ?

              <div className={styles.empty}>

                <p>
                  Your cart is empty
                </p>

              </div>

              :

              cart.map((item, i) => {

                const product =
                  item?.productId;

                if (!product) return null;

                return (

                  <div
                    className={styles.lmain}
                    key={item._id || i}
                  >

                    <div className={styles.lcard}>

                      {/* IMAGE */}

                      <div className={styles.cimg}>

                        <img
                          src={
                            product.images?.[0]?.url
                            || BULB
                          }
                          alt=""
                        />

                      </div>

                      {/* CONTENT */}

                      <div className={styles.cartcen}>

                        <p className={styles.cenhead}>

                          {product.name}

                        </p>

                        <p className={styles.censub}>

                          {product.subName}

                        </p>

                        <p className={styles.cenprice}>

                          ₹{product.price}

                        </p>

                        {/* QUANTITY */}

                        <div className={styles.quant}>

                          <button
                            className={styles.qbtn}
                            onClick={() =>
                              updateQty(
                                product._id,
                                "dec"
                              )
                            }
                          >

                            -

                          </button>

                          <p>
                            {item.quantity}
                          </p>

                          <button
                            className={styles.qbtn}
                            onClick={() =>
                              updateQty(
                                product._id,
                                "inc"
                              )
                            }
                          >

                            +

                          </button>

                        </div>

                      </div>

                      {/* RIGHT */}

                      <div className={styles.llast}>

                        <p
                          className={styles.cancel}
                          onClick={() =>
                            removeItem(product._id)
                          }
                        >

                          ✕

                        </p>

                        <p className={styles.fprice}>

                          ₹
                          {
                            product.price
                            * item.quantity
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                );

              })

            }

          </div>

          {/* ================= RIGHT ================= */}

          <div className={styles.right}>

            <h2 className={styles.rhead}>

              Order Summary

            </h2>

            <div className={styles.rmain}>

              <div className={styles.rsub}>

                <p>
                  Subtotal ({cart.length} items)
                </p>

                <p className={styles.value}>

                  ₹{subtotal.toFixed(0)}

                </p>

              </div>

              <div className={styles.rsub}>

                <p>
                  GST ({settings.gst}%)
                </p>

                <p className={styles.value}>

                  ₹{gst.toFixed(0)}

                </p>

              </div>

              <div className={styles.rsub}>

                <p>
                  Delivery Charges
                </p>

                <p className={styles.value}>

                  ₹{delivery}

                </p>

              </div>

            </div>

            <div className={styles.totalRow}>

              <p className={styles.subtotal}>

                Total Amount

              </p>

              <p className={styles.totalPrice}>

                ₹{total.toFixed(0)}

              </p>

            </div>

            <button
              className={styles.checkout}
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    cart,
                    subtotal,
                    gst,
                    delivery,
                    total
                  }
                })
              }
            >

              <FaLock />

              Go to Checkout

            </button>

          </div>

        </div>

        <Footer />

      </div>

    </>

  );

}