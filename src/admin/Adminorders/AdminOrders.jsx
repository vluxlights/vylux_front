import AdminHeader from "../AdminHeader/AdminHeader";
import styles from "./AdminOrders.module.css";
import AdminSidebar from "../AdminHome/AdminSidebar";
import { Helmet } from "react-helmet";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    FaSearch,
    FaChevronRight,
    FaChevronDown,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaSyncAlt
} from "react-icons/fa";

export default function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const [openDetails, setOpenDetails] = useState({});

    const itemsPerPage = 3;

    const token = localStorage.getItem("token");

    /* ================= FETCH ORDERS ================= */

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

    /* ================= FILTER + SORT ================= */

    const filteredOrders = useMemo(() => {

        return orders
            .filter((order) =>

                order.address?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                order.address?.phone?.includes(search)

            )
            .sort((a, b) =>

                sortOrder === "newest"
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt)

            );

    }, [orders, search, sortOrder]);

    /* ================= PAGINATION ================= */

    const totalPages = Math.ceil(
        filteredOrders.length / itemsPerPage
    );

    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /* ================= TOGGLE DETAILS ================= */

    const toggleDetails = (id) => {

        setOpenDetails((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));

    };

    return (

        <div className={styles.cont}>

            <Helmet>
                <title>Admin Orders</title>
            </Helmet>

            <AdminHeader />

            <div className={styles.main}>

                <div className={styles.left}>
                    <AdminSidebar />
                </div>

                <div className={styles.right}>

                    {/* ================= TOP ================= */}

                    <div className={styles.top}>

                        <h1>User Orders</h1>

                        <p>
                            View and manage all customer orders
                        </p>

                    </div>

                    {/* ================= FILTER ================= */}

                    <div className={styles.filterBox}>

                        {/* SEARCH */}

                        <div className={styles.searchBox}>

                            <FaSearch className={styles.searchIcon} />

                            <input
                                type="text"
                                placeholder="Search by customer name or phone"
                                value={search}
                                onChange={(e) => {

                                    setSearch(e.target.value);
                                    setCurrentPage(1);

                                }}
                            />

                        </div>

                        {/* SORT */}

                        <select
                            className={styles.select}
                            value={sortOrder}
                            onChange={(e) => {

                                setSortOrder(e.target.value);
                                setCurrentPage(1);

                            }}
                        >

                            <option value="newest">
                                Newest First
                            </option>

                            <option value="oldest">
                                Oldest First
                            </option>

                        </select>

                        {/* BUTTONS */}

                        <div className={styles.btnRow}>

                            <button
                                className={styles.actionBtn}
                                onClick={fetchOrders}
                            >

                                <FaSyncAlt />

                                Refresh

                            </button>

                            <button
                                className={styles.actionBtn}
                                onClick={() => {

                                    setSearch("");
                                    setSortOrder("newest");
                                    setCurrentPage(1);

                                }}
                            >

                                Reset

                            </button>

                        </div>

                    </div>

                    {/* ================= ORDER LIST ================= */}

                    <div className={styles.orderList}>

                        {currentOrders.map((order) => (

                            <div
                                key={order._id}
                                className={styles.card}
                            >

                                {/* ================= ORDER TOP ================= */}

                                <div className={styles.cardTop}>

                                    <div className={styles.orderId}>

                                        Order ID:
                                        {" "}
                                        #{order._id.slice(-8).toUpperCase()}

                                    </div>

                                </div>

                                {/* ================= PRODUCTS ================= */}

                                {

                                    order.items.map((item, i) => (

                                        <div
                                            className={styles.productRow}
                                            key={i}
                                        >

                                            {/* IMAGE */}

                                            <img
                                                src={item.productId?.images?.[0]?.url}
                                                alt=""
                                            />

                                            {/* CENTER PRODUCT DETAILS */}

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

                                            </div>

                                            {/* RIGHT DATE + PRICE */}

                                            <div className={styles.rightInfo}>

                                                <div className={styles.dateBox}>

                                                    <FaCalendarAlt
                                                        className={styles.dateIcon}
                                                    />

                                                    <p>

                                                        {
                                                            new Date(
                                                                order.createdAt
                                                            ).toLocaleDateString()
                                                        }

                                                    </p>

                                                </div>

                                                <h3 className={styles.price}>

                                                    ₹{item.price * item.quantity}

                                                </h3>

                                            </div>

                                        </div>

                                    ))

                                }

                                {/* ================= DELIVERY BUTTON ================= */}

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
                                            View Details
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

                                            <div className={styles.totalBox}>

                                                <h2>
                                                    Total :
                                                    {" "}
                                                    ₹{order.total}
                                                </h2>

                                            </div>

                                        </div>

                                    )

                                }

                            </div>

                        ))}

                    </div>

                    {/* ================= PAGINATION ================= */}

                    <div className={styles.pagination}>

                        {/* PREV */}

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

                        {/* PAGE */}

                        <p>

                            Page {currentPage} of {totalPages || 1}

                        </p>

                        {/* NEXT */}

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

            </div>

        </div>

    );

}