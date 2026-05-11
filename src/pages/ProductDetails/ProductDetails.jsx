import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProductDetails.module.css";
import { Helmet } from "react-helmet";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
  FaBolt,
  FaClock,
  FaShieldAlt
} from "react-icons/fa";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const increase = () => setQty(prev => prev + 1);

  const decrease = () => {
    setQty(prev => (prev > 1 ? prev - 1 : 1));
  };

  // ================= ADD TO CART =================

  const addToCart = async () => {
    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "https://vlux-backend.onrender.com/api/vlux/cart/add",
        {
          productId: product._id,
          quantity: qty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Added to cart");

    } catch (err) {
      console.log(err);
      alert("Failed to add to cart");
    }
  };

  // ================= BUY NOW =================

  const buyNow = async () => {
    await addToCart();
    navigate("/cartpage");
  };

  // ================= FETCH PRODUCT =================

  const fetchProduct = async () => {
    try {

      const res = await axios.get(
        `https://vlux-backend.onrender.com/api/vlux/adminproducts/${id}`
      );

      const data = res.data.product;

      setProduct(data);

      setSelectedImage(data?.images?.[0]?.url || null);

      if (data?.type) {
        fetchRelated(data.type, data._id);
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ================= RELATED =================

  const fetchRelated = async (type, currentId) => {

    try {

      const res = await axios.get(
        `https://vlux-backend.onrender.com/api/vlux/adminproducts?type=${type}&limit=10`
      );

      const filtered = res.data.products
        .filter(p => p._id !== currentId)
        .slice(0, 6);

      setRelated(filtered);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    fetchProduct();
    setQty(1);

  }, [id]);

  if (!product) return <p>Loading...</p>;

  const images = product.images || [];

  const specs = {
    Product_ID: product.productId,
    Name: product.name,
    Type: product.type,
    Model: product.modelNumber,
    Warranty: product.warranty,
    Color: product.color,
    Power: product.powerConsumption,
    Housing: product.housingSize,
    Power_Factor: product.powerFactor,
    THD: product.thd,
    Lumens: product.lumens,
    Temperature: product.colorTemperature,
    Surge: product.surgeProtection,
    Frequency: product.lineFrequency,
    Voltage: product.ratedVoltage,
    Operating_Voltage: product.operatingVoltage,
    CRI: product.cri,
    Material: product.housingMaterial,
    Base_Type: product.baseType,
    Average_Life: product.averageLife
  };

  return (
    <>
      <Header />

      <Helmet>
        <title>{product.name}</title>
      </Helmet>

      {/* ================= PRODUCT ================= */}

      <div className={styles.productWrapper}>

        {/* ================= IMAGES ================= */}

        <div className={styles.imageSection}>

          {/* MAIN IMAGE */}

          <div className={styles.mainImageBox}>
            <img
              src={selectedImage || images[0]?.url}
              alt={product.name}
              className={styles.mainImage}
            />
          </div>

          {/* THUMBNAILS */}

          <div className={styles.thumbnailRow}>

            {images.map((img, i) => (
              <div
                className={styles.thumb}
                key={i}
                onClick={() => setSelectedImage(img.url)}
              >
                <img src={img.url} alt="" />
              </div>
            ))}

          </div>

        </div>

        {/* ================= DETAILS ================= */}

        <div className={styles.details}>

          <h1>{product.name}</h1>

          <p className={styles.color}>
            {product.color}
          </p>

          {/* PRICE */}

          <div className={styles.priceSection}>

            <p className={styles.price}>
              ₹{product.price}
            </p>

            <p className={styles.oldPrice}>
              ₹{
                Math.round(
                  product.price +
                  (product.price * product.discountPercentage / 100)
                )
              }
            </p>

            <span className={styles.discount}>
              {product.discountPercentage}% OFF
            </span>

          </div>

          {/* FEATURES */}

          <div className={styles.features}>

            <div className={styles.feature}>
              <FaBolt />
              <p>Energy Efficient</p>
            </div>

            <div className={styles.feature}>
              <FaClock />
              <p>Long Life</p>
            </div>

            <div className={styles.feature}>
              <FaShieldAlt />
              <p>Quality Assured</p>
            </div>

          </div>

          {/* QUANTITY */}

          <div className={styles.quantitySection}>

            <p>Quantity</p>

            <div className={styles.qtyBox}>

              <button onClick={decrease}>−</button>

              <span>{qty}</span>

              <button onClick={increase}>+</button>

            </div>

          </div>

          {/* BUTTONS */}

          <div className={styles.buttons}>

            <button
              className={styles.cartBtn}
              onClick={addToCart}
            >
              Add To Cart
            </button>

            <button
              className={styles.buyBtn}
              onClick={buyNow}
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* ================= SPECIFICATIONS ================= */}

      <div className={styles.specs}>

        <h2>Product Details</h2>

        <div className={styles.specGrid}>

          {Object.entries(specs).map(([key, value]) => (

            <div className={styles.specRow} key={key}>

              <p className={styles.specKey}>
                {key.replaceAll("_", " ")}
              </p>

              <p className={styles.specValue}>
                {value || "-"}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* ================= RELATED ================= */}

      <div className={styles.related}>

        <h2>Related Products</h2>

        <div className={styles.relatedRow}>

          {related.map((p) => (

            <div
              className={styles.relatedCard}
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
            >

              <img
                src={p.images?.[0]?.url}
                alt=""
              />

              <p className={styles.relatedName}>
                {p.name}
              </p>

              <p className={styles.relatedColor}>
                {p.color}
              </p>

              <p className={styles.relatedPrice}>
                ₹{p.price}
              </p>

            </div>

          ))}

        </div>

      </div>

      <Footer />
    </>
  );
}