import AdminHeader from "../AdminHeader/AdminHeader";
import styles from "./AdminOrders.module.css";
import AdminSidebar from "../AdminHome/AdminSidebar";
import { Helmet } from "react-helmet";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

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
                order.address?.name?.toLowerCase().includes(search.toLowerCase()) ||
                order.address?.phone?.includes(search)
            )
            .sort((a, b) =>
                sortOrder === "newest"
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt)
            );

    }, [orders, search, sortOrder]);

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

                    <h2>User Orders</h2>

                    {/* ================= FILTER ================= */}
                    <div className={styles.rtop}>

                        <div className={styles.rsearch}>
                            <p>Search Order</p>
                            <input
                                type="text"
                                placeholder="Search by name or phone"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <div className={styles.rcat}>
                            <p>Sort by Date</p>
                            <select
                                value={sortOrder}
                                onChange={(e) => {
                                    setSortOrder(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>

                        <div className={styles.rbtn}>
                            <button
                                className={styles.rbtns}
                                onClick={fetchOrders}
                            >
                                Refresh
                            </button>

                            <button
                                className={styles.rbtns}
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

                    {/* ================= ORDERS ================= */}
                    <div className={styles.orderContainer}>

                        {currentOrders.map((order) => (

                            <div key={order._id} className={styles.orderCard}>

                                {/* LEFT - PRODUCTS */}
                                <div className={styles.cardLeft}>

                                    {order.items.map((item, i) => (

                                        <div key={i} className={styles.productRow}>

                                            <img
                                                src={item.productId?.images?.[0]?.url}
                                                alt=""
                                            />

                                            <div>
                                                <p className={styles.pname}>
                                                    {item.productId?.name}
                                                </p>

                                                <p className={styles.model}>
                                                    Model: {item.productId?.modelNumber}
                                                </p>

                                                <p className={styles.qty}>
                                                    Qty: {item.quantity}
                                                </p>

                                                <p className={styles.price}>
                                                    ₹{item.price * item.quantity}
                                                </p>
                                            </div>

                                        </div>

                                    ))}

                                </div>

                                {/* RIGHT - USER DETAILS (LABEL HIGHLIGHT FIXED) */}
                                <div className={styles.cardRight}>

                                    <p><b>User Details</b></p>

                                    <p>
                                        <span className={styles.label}>Name :</span>
                                        <span className={styles.value}>{order.address?.name}</span>
                                    </p>

                                    <p>
                                        <span className={styles.label}>Phone :</span>
                                        <span className={styles.value}>{order.address?.phone}</span>
                                    </p>

                                    <p>
                                        <span className={styles.label}>Address :</span>
                                        <span className={styles.value}>{order.address?.address}</span>
                                    </p>

                                    <p>
                                        <span className={styles.label}>City :</span>
                                        <span className={styles.value}>{order.address?.city}</span>
                                    </p>

                                    <p>
                                        <span className={styles.label}>State :</span>
                                        <span className={styles.value}>{order.address?.state}</span>
                                    </p>

                                    <p>
                                        <span className={styles.label}>Pincode :</span>
                                        <span className={styles.value}>{order.address?.pincode}</span>
                                    </p>

                                    <p>
                                        <span className={styles.label}>Landmark :</span>
                                        <span className={styles.value}>{order.address?.landmark}</span>
                                    </p>

                                    <hr />

                                    <p className={styles.total}>
                                        Total : ₹{order.total}
                                    </p>

                                    <p className={styles.date}>
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* ================= PAGINATION ================= */}
                    <div style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px",
                        justifyContent: "center"
                    }}>

                        <button
                            className={styles.rbtns}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>

                        <p className={styles.pageno}>
                            Page {currentPage} of {totalPages || 1}
                        </p>

                        <button
                            className={styles.rbtns}
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}