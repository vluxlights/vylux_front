import styles from "./Products.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Helmet } from "react-helmet";

import {
  FaFilter,
  FaSortAmountDown,
  FaShoppingCart,
  FaChevronLeft,
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
            type: category !== "all"
              ? category
              : undefined
          }
        }
      );

      let fetchedProducts = res.data.products || [];

      // ================= SORT =================

      fetchedProducts.sort((a, b) => {

        if (sort === "low") {
          return a.price - b.price;
        }

        return b.price - a.price;

      });

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

  // ================= PAGINATION =================

  const nextPage = () => {

    if (page * limit < total) {

      setPage((prev) => prev + 1);

    }

  };

  const prevPage = () => {

    setPage((prev) => Math.max(prev - 1, 1));

  };

  // ================= PRODUCT PAGE =================

  const openProduct = (id) => {

    navigate(`/product/${id}`);

  };

  return (

    <div className={styles.container}>

      <Helmet>
        <title>Products</title>
      </Helmet>

      <Header />

      {/* ================= MAIN ================= */}

      <div className={styles.main}>

        {/* ================= TOP BAR ================= */}

        <div className={styles.topBar}>

          {/* CATEGORY */}

          <div className={styles.filterBox}>

            <FaFilter className={styles.topIcon} />

            <span>
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

            <FaSortAmountDown className={styles.topIcon} />

            <span>
              Sort by:
            </span>

            <select
              value={sort}
              onChange={(e) => {

                setSort(e.target.value);

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

            // ================= OFFER =================

            const oldPrice =
              p.oldPrice || p.price + 50;

            const offer =
              Math.round(
                ((oldPrice - p.price) / oldPrice) * 100
              );

            return (

              <div
                key={p._id}
                className={styles.card}
                onClick={() => openProduct(p._id)}
              >

                {/* OFFER BADGE */}

                <div className={styles.offerBadge}>

                  -{offer}%

                </div>

                {/* IMAGE */}

                <div className={styles.imageBox}>

                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                  />

                </div>

                {/* CONTENT */}

                <div className={styles.content}>

                  <h3>
                    {p.name}
                  </h3>

                  <p>
                    {p.subName}
                  </p>

                  {/* PRICE */}

                  <div className={styles.priceRow}>

                    <h2>
                      ₹{p.price}
                    </h2>

                    <span>
                      ₹{oldPrice}
                    </span>

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

          <button
            onClick={prevPage}
            disabled={page === 1}
          >

            <FaChevronLeft />

          </button>

          <div className={styles.pageNo}>

            {page}

          </div>

          <button
            onClick={nextPage}
            disabled={page * limit >= total}
          >

            <FaChevronRight />

          </button>

        </div>

      </div>

      <Footer />

    </div>

  );

}