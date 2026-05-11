import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import styles from "./MyOrders.module.css";

import {
  FaSearch,
  FaChevronRight,
  FaChevronDown,
  FaCalendarAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [openDetails, setOpenDetails] = useState({});

  const token = localStorage.getItem("token");

  const itemsPerPage = 2;

  // ================= FETCH ORDERS =================

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/order/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(res.data || []);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchOrders();

  }, []);

  // ================= SEARCH =================

  const filteredOrders = useMemo(() => {

    return orders.filter((order) =>

      order?.address?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      order?.address?.phone?.includes(search)

    );

  }, [orders, search]);

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    filteredOrders.length / itemsPerPage
  );

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= TOGGLE DETAILS =================

  const toggleDetails = (id) => {

    setOpenDetails((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));

  };

  return (

    <>

      <Helmet>
        <title>My Orders</title>
      </Helmet>

      <Header />

      <div className={styles.container}>

        {/* ================= TOP ================= */}

        <div className={styles.top}>

          <h1>My Orders</h1>

          <p>
            Track and view all your orders
          </p>

          {/* SEARCH */}

          <div className={styles.searchRow}>

            <div className={styles.searchBox}>

              <FaSearch className={styles.searchIcon} />

              <input
                type="text"
                placeholder="Search by order ID or phone"
                value={search}
                onChange={(e) => {

                  setSearch(e.target.value);
                  setCurrentPage(1);

                }}
              />

            </div>

          </div>

        </div>

        {/* ================= ORDERS ================= */}

        <div className={styles.orderList}>

          {currentOrders.map((order) => (

            <div
              key={order._id}
              className={styles.card}
            >

              {/* ================= ORDER ID ================= */}

              <div className={styles.cardTop}>

                <div className={styles.orderId}>

                  Order ID:
                  {" "}
                  #{order._id.slice(-8).toUpperCase()}

                </div>

              </div>

              {/* ================= PRODUCTS ================= */}

              {order.items.map((item, i) => (

                <div
                  className={styles.productRow}
                  key={i}
                >

                  {/* IMAGE */}

                  <img
                    src={item.productId?.images?.[0]?.url}
                    alt=""
                  />

                  {/* CONTENT */}

                  <div className={styles.productContent}>

                    <h2>
                      {item.productId?.name}
                    </h2>

                    <p>
                      Model:
                      {" "}
                      {item.productId?.modelNumber}
                    </p>

                    <p>
                      Qty:
                      {" "}
                      {item.quantity}
                    </p>

                    <h3>
                      ₹{item.price * item.quantity}
                    </h3>

                  </div>

                </div>

              ))}

              {/* ================= DETAILS ROW ================= */}

              <div className={styles.detailsRow}>

                {/* DATE */}

                <div className={styles.detailBox}>

                  <FaCalendarAlt
                    className={styles.detailIcon}
                  />

                  <div>

                    <p className={styles.label}>
                      Order Date
                    </p>

                    <h4>

                      {
                        new Date(
                          order.createdAt
                        ).toLocaleString()
                      }

                    </h4>

                  </div>

                </div>

                <div className={styles.vertical}></div>

                {/* TOTAL */}

                <div className={styles.detailBox}>

                  <div>

                    <p className={styles.label}>
                      Total Amount
                    </p>

                    <h4 className={styles.amount}>
                      ₹{order.total}
                    </h4>

                  </div>

                </div>

              </div>

              {/* ================= DELIVERY TOGGLE ================= */}

              <div
                className={styles.deliveryHead}
                onClick={() =>
                  toggleDetails(order._id)
                }
              >

                <div className={styles.deliveryLeft}>

                  <FaMapMarkerAlt />

                  <span>
                    Delivery Details
                  </span>

                </div>

                <div className={styles.deliveryRight}>

                  <span>
                    View details
                  </span>

                  <FaChevronDown
                    className={
                      openDetails[order._id]
                        ? styles.rotate
                        : ""
                    }
                  />

                </div>

              </div>

              {/* ================= DELIVERY DETAILS ================= */}

              {

                openDetails[order._id] && (

                  <div className={styles.deliveryBox}>

                    <p>
                      <span>Name:</span>
                      {" "}
                      {order.address?.name}
                    </p>

                    <p>
                      <span>Phone:</span>
                      {" "}
                      {order.address?.phone}
                    </p>

                    <p>
                      <span>Address:</span>
                      {" "}
                      {order.address?.address}
                    </p>

                    <p>
                      <span>City:</span>
                      {" "}
                      {order.address?.city}
                    </p>

                    <p>
                      <span>State:</span>
                      {" "}
                      {order.address?.state}
                    </p>

                    <p>
                      <span>Pincode:</span>
                      {" "}
                      {order.address?.pincode}
                    </p>

                    <p>
                      <span>Landmark:</span>
                      {" "}
                      {order.address?.landmark}
                    </p>

                  </div>

                )

              }

            </div>

          ))}

        </div>

        {/* ================= PAGINATION ================= */}

        <div className={styles.pagination}>

          {/* PREV BUTTON */}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(prev - 1, 1)
              )
            }
            disabled={currentPage === 1}
          >

            ←

          </button>

          {/* PAGE TEXT */}

          <p>

            Page {currentPage} of {totalPages || 1}

          </p>

          {/* NEXT BUTTON */}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
          >

            <FaChevronRight />

          </button>

        </div>

      </div>

      <Footer />

    </>

  );

}