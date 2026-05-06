import Header from "../../components/Header/Header";
import styles from "./Home.module.css";
import BANNER from "../../assests/Home_page/banner.jpeg";
import BULB from "../../assests/Home_page/category/bulb.jpeg";
import Footer from "../../components/Footer/Footer";
import { Helmet } from "react-helmet";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BsThreeDots } from "react-icons/bs";

export default function Home() {

  const navigate = useNavigate();

  const [banner, setBanner] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchBanner = async () => {
    try {
      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/adminhome/banner"
      );
      setBanner(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/adminhome/category"
      );
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/adminproducts?limit=6"
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBanner();
    fetchCategories();
    fetchProducts();
  }, []);

  const handleCategoryClick = (cat) => {
    navigate(`/products?category=${cat.category}`);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const getFinalPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  return (
    <>
      <div className={styles.cont}>

        <Helmet>
          <title>Vlux Home Page</title>
        </Helmet>

        <Header />

        {/* ---------- BANNER ---------- */}
        <div className={styles.banner}>
          <img src={banner?.image || BANNER} alt="banner" />
        </div>

        {/* ---------- CATEGORY ---------- */}
        <div className={styles.category}>
          <p className={styles.shopbycat}>SHOP BY CATEGORY</p>
          <hr className={styles.hr} />

          <div className={styles.cats}>

            {categories.slice(0, 5).map((cat) => (
              <div
                className={styles.catitem}
                key={cat._id}
                onClick={() => handleCategoryClick(cat)}
                style={{ cursor: "pointer" }}
              >
                <img src={cat.image || BULB} />
                <div className={styles.line}></div>
                <p className={styles.catText}>{cat.category}</p>
              </div>
            ))}

            <div className={styles.catitem}>
              <BsThreeDots className={styles.more} />
              <p>More</p>
            </div>

          </div>
        </div>

        {/* ---------- NEW ARRIVALS ---------- */}
        <div className={styles.new}>

          <p>NEW ARRIVALS</p>
          <hr className={styles.hr} />

          <div className={styles.news}>

            {products.map((item) => {

              const price = Number(item.price || 0);
              const discount = Number(item.discountPercentage || 0);
              const finalPrice = discount
                ? price - (price * discount) / 100
                : price;

              return (
                <div
                  className={styles.newitem}
                  key={item._id}
                  onClick={() => handleProductClick(item._id)}
                  style={{ cursor: "pointer" }}
                >

                  <img src={item.images?.[0]?.url || BULB} />

                  <div className={styles.newitemcont}>

                    {/* NAME */}
                    <p className={styles.head} style={{ fontSize: "15px", fontWeight: "700" }} >{item.name}</p>

                    {/* SUB NAME */}
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                      {item.subName}
                    </p>

                    {/* PRICE SECTION (FIXED ONLY) */}
                    <div style={{ marginTop: "6px" }}>

                      {/* FINAL PRICE */}
                      <p style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#0c5a5e"
                      }}>
                        ₹{finalPrice.toFixed(2)}
                      </p>

                      {/* ORIGINAL PRICE (SMALL + STRIKE + BELOW) */}
                      {discount > 0 && (
                        <p style={{
                          fontSize: "11px",
                          textDecoration: "line-through",
                          color: "gray",
                          marginTop: "2px"
                        }}>
                          ₹{price}
                        </p>
                      )}

                    </div>

                    {/* DISCOUNT BADGE */}
                    {discount > 0 && (
                      <div style={{
                        marginTop: "5px",
                        display: "inline-block",
                        background: "#ff4d4d",
                        color: "white",
                        fontSize: "11px",
                        padding: "2px 6px",
                        borderRadius: "4px"
                      }}>
                        {discount}% OFF
                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        <Footer />

      </div>
    </>
  );
}