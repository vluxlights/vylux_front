import styles from "./Products.module.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { Helmet } from "react-helmet";

import {
  FaFilter,
  FaSortAmountDown,
  FaShoppingCart,
  FaChevronRight
} from "react-icons/fa";

import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState("all");

  const [sort, setSort] = useState("low");

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
            type: category !== "all" ? category : undefined
          }
        }
      );

      let fetchedProducts = res.data.products || [];

      // ================= SORT =================

      if (sort === "low") {

        fetchedProducts.sort((a, b) => a.price - b.price);

      } else {

        fetchedProducts.sort((a, b) => b.price - a.price);

      }

      setProducts(fetchedProducts);

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

  }, [page, category, sort]);

  // ================= OPEN PRODUCT =================

  const openProduct = (id) => {

    navigate(`/product/${id}`);

  };

  // ================= OFFER =================

  const getOfferPercentage = (oldPrice, newPrice) => {

    if (!oldPrice || oldPrice <= newPrice) return null;

    return Math.round(
      ((oldPrice - newPrice) / oldPrice) * 100
    );

  };

  return (

    <div className={styles.container}>

      <Helmet>

        <title>
          Products
        </title>

      </Helmet>

      <Header />

      {/* ================= MAIN ================= */}

      <div className={styles.main}>

        {/* ================= FILTER + SORT ================= */}

        <div className={styles.topBar}>

          {/* FILTER */}

          <div className={styles.filterBox}>

            <FaFilter className={styles.filterIcon} />

            <span className={styles.filterLabel}>
              Filter:
            </span>

            <select
              value={category}
              onChange={(e) => {

                setCategory(e.target.value);
                setPage(1);

              }}
            >

              <option value="all">
                All Categories
              </option>

              {categories.map((c) => {

                const catName =
                  c.name || c.category || "Unknown";

                return (

                  <option
                    key={c._id}
                    value={catName}
                  >

                    {catName}

                  </option>

                );

              })}

            </select>

          </div>

          {/* SORT */}

          <div className={styles.filterBox}>

            <FaSortAmountDown className={styles.filterIcon} />

            <span className={styles.filterLabel}>
              Sort:
            </span>

            <select
              value={sort}
              onChange={(e) => {

                setSort(e.target.value);
                setPage(1);

              }}
            >

              <option value="low">
                Price Low to High
              </option>

              <option value="high">
                Price High to Low
              </option>

            </select>

          </div>

        </div>

        {/* ================= PRODUCTS ================= */}

        {loading && (

          <p className={styles.loading}>
            Loading...
          </p>

        )}

        <div className={styles.productGrid}>

          {products.map((p) => {

            const offer =
              getOfferPercentage(
                p.oldPrice,
                p.price
              );

            return (

              <div
                key={p._id}
                className={styles.card}
                onClick={() => openProduct(p._id)}
              >

                {/* OFFER */}

                {offer && (

                  <div className={styles.offerTag}>

                    -{offer}%

                  </div>

                )}

                {/* IMAGE */}

                <div className={styles.imageBox}>

                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                  />

                </div>

                {/* CONTENT */}

                <div className={styles.content}>

                  <h2>
                    {p.name}
                  </h2>

                  <p>
                    {p.subName}
                  </p>

                  {/* PRICE */}

                  <div className={styles.priceRow}>

                    <span className={styles.price}>
                      ₹{p.price}
                    </span>

                    {p.oldPrice && (

                      <span className={styles.oldPrice}>

                        ₹{p.oldPrice}

                      </span>

                    )}

                  </div>

                  {/* BUTTON */}

                  <button className={styles.cartBtn}>

                    <FaShoppingCart />

                    Add to Cart

                  </button>

                </div>

              </div>

            );

          })}

        </div>

        {/* ================= PAGINATION ================= */}

        <div className={styles.pagination}>

          <button className={styles.activePage}>
            1
          </button>

          <button className={styles.pageBtn}>
            2
          </button>

          <button className={styles.pageBtn}>
            3
          </button>

          <button className={styles.pageBtn}>
            4
          </button>

          <button className={styles.pageBtn}>
            5
          </button>

          <button className={styles.pageBtn}>
            ...
          </button>

          <button
            className={styles.pageBtn}
          >

            <FaChevronRight />

          </button>

        </div>

      </div>

      <Footer />

    </div>

  );

}