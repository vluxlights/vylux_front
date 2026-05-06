import AdminHeader from "../AdminHeader/AdminHeader";
import styles from "./AdminViewProduct.module.css";
import AdminSideBar from "../AdminHome/AdminSidebar";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function AdminViewProduct() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [message, setMessage] = useState("");

    // ================= PAGINATION STATES =================
    const [page, setPage] = useState(1);
    const limit = 10;
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page]);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const params = {
                page,
                limit
            };

            if (search) params.name = search;
            if (category) params.type = category;

            const res = await axios.get(
                "https://vlux-backend.onrender.com/api/vlux/adminproducts",
                { params }
            );

            setProducts(res.data.products);
            setTotal(res.data.total || 0);

        } catch (err) {
            console.log(err);
        }
    };

    // ================= FETCH CATEGORIES =================
    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                "https://vlux-backend.onrender.com/api/vlux/admincategories"
            );

            setCategories(res.data.categories);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= DELETE PRODUCT =================
    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(
                `https://vlux-backend.onrender.com/api/vlux/adminproducts/${id}`
            );

            setMessage("Product deleted successfully ✅");
            fetchProducts();

            setTimeout(() => setMessage(""), 3000);

        } catch (err) {
            console.log(err);
            setMessage("Failed to delete product ❌");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // ================= EDIT PRODUCT NAVIGATION =================
    const handleEdit = (id) => {
        navigate(`/admin/edit-product/${id}`);
    };

    // ================= FILTER =================
    const handleFilter = () => {
        setPage(1);
        fetchProducts();
    };

    // ================= RESET =================
    const handleReset = () => {
        setSearch("");
        setCategory("");
        setPage(1);
        fetchProducts();
    };

    // ================= PAGINATION =================
    const nextPage = () => {
        if (page * limit < total) {
            setPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    // ================= CATEGORY ADD =================
    const handleAddCategory = async () => {
        if (!newCategory) return;

        try {
            await axios.post("https://vlux-backend.onrender.com/api/vlux/admincategories", {
                name: newCategory
            });

            setMessage(`Category added successfully ✅`);
            setNewCategory("");
            fetchCategories();

            setTimeout(() => setMessage(""), 3000);

        } catch (err) {
            console.log(err);
            setMessage("Failed to add category ❌");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // ================= CATEGORY DELETE =================
    const handleDeleteCategory = async (id) => {

        if (!id) return;

        try {
            await axios.delete(
                `https://vlux-backend.onrender.com/api/vlux/admincategories/${id}`
            );

            setMessage("Category deleted successfully ✅");
            setCategory("");
            fetchCategories();

            setTimeout(() => setMessage(""), 3000);

        } catch (err) {
            console.log(err);
            setMessage("Failed to delete category ❌");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div className={styles.cont}>

            <Helmet>
                <title>Admin All Products</title>
            </Helmet>

            <AdminHeader />

            <div className={styles.main}>

                <div className={styles.left}>
                    <AdminSideBar />
                </div>

                <div className={styles.right}>

                    <h2>All Products</h2>

                    {/* ================= FILTER ================= */}
                    <div className={styles.rtop}>

                        <div className={styles.rsearch}>
                            <p>Search Product</p>
                            <input
                                type="text"
                                placeholder="Search by Product Name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className={styles.rcat}>
                            <p>Category</p>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All</option>

                                {categories.map((c) => (
                                    <option key={c._id} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className={styles.rbtn}>
                            <button className={styles.rbtns} onClick={handleFilter}>
                                Filter
                            </button>

                            <button className={styles.rbtns} onClick={handleReset}>
                                Reset
                            </button>
                        </div>

                    </div>

                    {/* ================= CATEGORY ================= */}
                    <div className={styles.addCategoryBox}>

                        <p>Manage Categories</p>

                        <div className={styles.categoryRow}>

                           <div className={styles.cataddbtn}>

                             <input
                                type="text"
                                placeholder="Enter new category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />

                            <button onClick={handleAddCategory} className={styles.addbtn}>
                                Add
                            </button>
                           </div>

                           <div className={styles.catdelbtn}>
                             <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Delete category</option>

                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}

                            </select>

                            <button className={styles.addbtn} onClick={() => handleDeleteCategory(category)}>
                                Delete
                            </button>
                           </div>

                        </div>

                    </div>

                    {/* ================= MESSAGE ================= */}
                    {message && (
                        <div className={styles.popupMsg}>
                            {message}
                        </div>
                    )}

                    {/* ================= TABLE ================= */}
                    <div className={styles.tableContainer}>

                        <table className={styles.table}>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Date Added</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {products.length > 0 ? (
                                    products.map((p) => (
                                        <tr key={p._id}>

                                            <td>{p.productId}</td>

                                            <td>
                                                <img src={p.images?.[0]?.url} className={styles.pimg} />
                                            </td>

                                            <td>{p.name}</td>

                                            <td>{p.category || p.type}</td>

                                            <td>₹{p.price}</td>

                                            <td>
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </td>

                                            <td>
                                                <button
                                                    className={styles.editBtn}
                                                    onClick={() => handleEdit(p._id)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(p._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No Products Found</td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* ================= PAGINATION ================= */}
                    <div className={styles.pagination}>

                        <button onClick={prevPage} disabled={page === 1} className={styles.prevbtn}>
                            ← Prev
                        </button>

                        <span>Page {page}</span>

                        <button
                            className={styles.prevbtn}
                            onClick={nextPage}
                            disabled={page * limit >= total}
                        >
                            Next →
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}