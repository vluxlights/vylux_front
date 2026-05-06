import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./MyOrders.module.css";

export default function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const token = localStorage.getItem("token");
    const itemsPerPage = 2;

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

    const filteredOrders = useMemo(() => {
        return orders.filter((order) =>
            order?.address?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order?.address?.phone?.includes(search)
        );
    }, [orders, search]);

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <Header />

            <Helmet>
                <title>My Orders</title>
            </Helmet>

            <div className={styles.container}>

                {/* TOP */}
                <div className={styles.top}>
                    <h2>My Orders</h2>

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

                {/* ORDERS */}
                <div className={styles.list}>

                    {currentOrders.map((order) => (

                        <div key={order._id} className={styles.card}>

                            {/* LEFT */}
                            <div className={styles.left}>

                                {order.items.map((item, i) => (
                                    <div key={i} className={styles.product}>

                                        <img
                                            src={item.productId?.images?.[0]?.url}
                                            alt=""
                                        />

                                        <div className={styles.pinfo}>
                                            <p className={styles.name}>
                                                {item.productId?.name}
                                            </p>

                                            <p>Model: {item.productId?.modelNumber}</p>
                                            <p>Qty: {item.quantity}</p>

                                            <p className={styles.price}>
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>

                                    </div>
                                ))}

                            </div>

                            {/* RIGHT (ADDRESS + DETAILS) */}
                            <div className={styles.rightCard}>

                                <p className={styles.sectionTitle}>
                                    Delivery Details
                                </p>

                                <div className={styles.infoBox}>
                                    <p><span>Name:</span> {order.address?.name}</p>
                                    <p><span>Phone:</span> {order.address?.phone}</p>
                                    <p><span>Address:</span> {order.address?.address}</p>
                                    <p><span>City:</span> {order.address?.city}</p>
                                    <p><span>State:</span> {order.address?.state}</p>
                                    <p><span>Pincode:</span> {order.address?.pincode}</p>
                                    <p><span>Landmark:</span> {order.address?.landmark}</p>
                                </div>

                                <div className={styles.totalBox}>
                                    ₹{order.total}
                                </div>

                                <p className={styles.date}>
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

                {/* ================= PAGINATION ================= */}
                <div className={styles.pagination}>

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className={styles.btn}
                    >
                        Prev
                    </button>

                    <p>
                        Page {currentPage} of {totalPages || 1}
                    </p>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className={styles.btn}
                    >
                        Next
                    </button>

                </div>

            </div>

            <Footer />
        </>
    );
}