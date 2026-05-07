import styles from "./Products.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Helmet } from "react-helmet";
import { FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Products() {

  const [value, setValue] = useState([0, 1000]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState("all");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const limit = 12;

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/adminproducts",
        {
          params: {
            page,
            limit,
            type: category !== "all" ? category : undefined,
            minPrice: value[0],
            maxPrice: value[1]
          }
        }
      );

      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {

    try {

      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/admincategories"
      );

      setCategories(res.data.categories || []);

    } catch (err) {

      console.log(err);

    }

  };

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, category, value]);

  // ================= SLIDER =================
  const handleChange = (event, newValue) => {

    setValue(newValue);
    setPage(1);

  };

  const handleMin = (e) => {

    const newMin = Math.min(
      Number(e.target.value),
      value[1] - 1
    );

    setValue([newMin, value[1]]);
    setPage(1);

  };

  const handleMax = (e) => {

    const newMax = Math.max(
      Number(e.target.value),
      value[0] + 1
    );

    setValue([value[0], newMax]);
    setPage(1);

  };

  // ================= PAGINATION =================
  const nextPage = () => {

    if (page * limit < total) {
      setPage((prev) => prev + 1);
    }

  };

  const prevPage = () => {

    setPage((prev) => Math.max(prev - 1, 1));

  };

  const start = total === 0
    ? 0
    : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  // ================= OPEN PRODUCT =================
  const openProduct = (id) => {

    navigate(`/product/${id}`);

  };

  return (

    <div className={styles.cont}>

      <Helmet>
        <title>Product Page</title>
      </Helmet>

      <Header />

      <div className={styles.main}>

        {/* ================= LEFT FILTER ================= */}
        <div className={styles.left}>

          <div className={styles.top}>

            <p>
              <FaBars />
              Filter
            </p>

            <button
              onClick={() => {

                setCategory("all");
                setValue([0, 10000]);
                setPage(1);

              }}
            >
              Clear All
            </button>

          </div>

          <hr />

          {/* ================= FLEX LEFT RIGHT ================= */}
          <div className={styles.flexlr}>

            {/* ================= CATEGORY ================= */}
            <div className={styles.cat}>

              <h2 className={styles.cathead}>
                Categories
              </h2>

              {/* ALL */}
              <div className={styles.catItem}>

                <input
                  type="radio"
                  id="all"
                  name="cat"
                  checked={category === "all"}
                  onChange={() => {

                    setCategory("all");
                    setPage(1);

                  }}
                />

                <label htmlFor="all">
                  All Categories
                </label>

              </div>

              {/* DYNAMIC */}
              {categories.map((c) => {

                const catName =
                  c.name || c.category || "Unknown";

                return (

                  <div
                    className={styles.catItem}
                    key={c._id}
                  >

                    <input
                      type="radio"
                      id={c._id}
                      name="cat"
                      checked={category === catName}
                      onChange={() => {

                        setCategory(catName);
                        setPage(1);

                      }}
                    />

                    <label htmlFor={c._id}>
                      {catName}
                    </label>

                  </div>

                );

              })}

            </div>

            <hr />

            {/* ================= PRICE ================= */}
            <div className={styles.price}>

              <div className={styles.pran}>

                <h2>Price Range</h2>

                <div className={styles.values}>

                  <span>₹{value[0]}</span>

                  <span>₹{value[1]}</span>

                </div>

                <Slider
                  value={value}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                />

              </div>

              <div className={styles.rangeBox}>

                <div>

                  <label>Min</label>

                  <input
                    type="number"
                    value={value[0]}
                    onChange={handleMin}
                  />

                </div>

                <div>

                  <label>Max</label>

                  <input
                    type="number"
                    value={value[1]}
                    onChange={handleMax}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className={styles.right}>

          <h2>All Products</h2>

          <p className={styles.sub}>

            Showing {start}-{end} of {total} products

          </p>

          {loading && <p>Loading...</p>}

          <div className={styles.rcont}>

            <div className={styles.rconts}>

              {products.map((p) => (

                <div
                  key={p._id}
                  className={styles.rcts}
                  onClick={() => openProduct(p._id)}
                >

                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                  />

                  <p className={styles.rchead}>
                    {p.name}
                  </p>

                  <p className={styles.rcsub}>
                    {p.subName}
                  </p>

                  <p className={styles.rcwatt}>
                    {p.powerConsumption}
                  </p>

                  <p className={styles.rcprice}>
                    ₹{p.price}
                  </p>

                  <button className={styles.rccart}>
                    Add to Cart
                  </button>

                </div>

              ))}

            </div>

            {/* ================= PAGINATION ================= */}
            <div className={styles.pagination}>

              <button
                className={styles.pageBtn}
                onClick={prevPage}
                disabled={page === 1}
              >
                ←
              </button>

              <button
                className={styles.pageBtn}
                onClick={nextPage}
                disabled={page * limit >= total}
              >
                →
              </button>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

}