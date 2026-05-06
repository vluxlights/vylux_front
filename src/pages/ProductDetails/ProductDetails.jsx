import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProductDetails.module.css";
import { Helmet } from "react-helmet";
import Heder from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { FaBolt, FaClock, FaShieldAlt } from "react-icons/fa";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const increase = () => setQty(prev => prev + 1);
  const decrease = () => setQty(prev => (prev > 1 ? prev - 1 : 1));

  // ================= ADD TO CART =================
  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://vlux-backend.onrender.com/api/vlux/cart/add",
        {
          productId: product._id,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    await addToCart();   // first add to cart
    navigate("/cartpage");   // then go to cart page
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

  const fetchRelated = async (type, currentId) => {
    try {
      const res = await axios.get(
        `https://vlux-backend.onrender.com/api/vlux/adminproducts?type=${type}&limit=10`
      );

      const filtered = res.data.products
        .filter(p => p._id !== currentId)
        .slice(0, 5);

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
    productId: product.productId,
    name: product.name,
    subName: product.subName,
    type: product.type,
    modelNumber: product.modelNumber,
    warranty: product.warranty,
    color: product.color,
    price: product.price,
    discountPercentage: product.discountPercentage,
    powerConsumption: product.powerConsumption,
    housingSize: product.housingSize,
    powerFactor: product.powerFactor,
    thd: product.thd,
    lumens: product.lumens,
    colorTemperature: product.colorTemperature,
    surgeProtection: product.surgeProtection,
    lineFrequency: product.lineFrequency,
    ratedVoltage: product.ratedVoltage,
    operatingVoltage: product.operatingVoltage,
    cri: product.cri,
    features: product.features,
    housingMaterial: product.housingMaterial,
    baseType: product.baseType,
    averageLife: product.averageLife,
  };

  return (
    <>
      <Heder />

      <Helmet>
        <title>{product.name}</title>
      </Helmet>

      {/* ================= PRODUCT VIEW ================= */}
      <div className={styles.productview}>

        <div className={styles.left}>
          {images.map((img, i) => (
            <div
              className={styles.img}
              key={i}
              onClick={() => setSelectedImage(img.url)}
            >
              <img src={img.url} alt={product.name} />
            </div>
          ))}
        </div>

        <div className={styles.center}>
          <img
            src={selectedImage || images[0]?.url}
            alt={product.name}
          />
        </div>

        <div className={styles.right}>

          <h2>{product.name}</h2>
          <p className={styles.type}>{product.color}</p>

          <div className={styles.pricelist}>
            <div className={styles.price}>
              <p>₹{product.price}</p>
            </div>

            <div className={styles.orprice}>
              <p>
                ₹{Math.round(
                  product.price +
                  (product.price * product.discountPercentage / 100)
                )}
              </p>
            </div>

            <div className={styles.discount}>
              <p>{product.discountPercentage}% OFF</p>
            </div>
          </div>

          <div className={styles.desc}>
            <div className={styles.descs}>
              <FaBolt />
              <p>Energy Efficient</p>
            </div>

            <div className={styles.descs}>
              <FaClock />
              <p>Long Life</p>
            </div>

            <div className={styles.descs}>
              <FaShieldAlt />
              <p>Quality Assured</p>
            </div>
          </div>

          <div className={styles.quantity}>
            <p>Quantity</p>

            <div className={styles.controls}>
              <button onClick={decrease}>-</button>
              <span>{qty}</span>
              <button onClick={increase}>+</button>
            </div>
          </div>

          {/* ================= ACTION BUTTONS (LOGIC ADDED) ================= */}
          <div className={styles.buttons}>
            <button
              className={styles.cart}
              onClick={addToCart}
            >
              Add to Cart
            </button>

            <button
              className={styles.buy}
              onClick={buyNow}
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>

      {/* SPECIFICATIONS */}
      <div className={styles.specs}>
        <h2>Product Details</h2>

        <div className={styles.spectable}>
          {Object.entries(specs).map(([key, value]) => (
            <div className={styles.row} key={key}>
              <p className={styles.key}>{key}</p>
              <p className={styles.value}>
                {value !== null && value !== undefined ? String(value) : "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RELATED */}
      <div className={styles.relatedp}>
        <h2>Related Products</h2>

        <div className={styles.repr}>
          {related.map((p) => (
            <div
              className={styles.reprs}
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={p.images?.[0]?.url} alt={p.name} />
              <p className={styles.rname}>{p.name}</p>
              <p className={styles.rtype}>{p.color}</p>
              <p className={styles.rprice}>₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}