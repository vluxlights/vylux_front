import AdminHeader from "../AdminHeader/AdminHeader";
import styles from "../AdminHome/AdminHome.module.css";
import BANNER from "../../assests/Home_page/banner.jpeg";
import AdminSidebar from "../AdminHome/AdminSidebar";

import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminHome() {

  // ================= CATEGORY =================
  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    category: "",
    imageFile: null
  });

  const [newPreview, setNewPreview] = useState("");

  // ================= BANNER =================
  const [banner, setBanner] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [tempBannerPreview, setTempBannerPreview] = useState("");

  // ================= FETCH CATEGORY =================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/adminhome/category"
      );
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH BANNER =================
  const fetchBanner = async () => {
    try {
      const res = await axios.get(
        "https://vlux-backend.onrender.com/api/vlux/adminhome/banner"
      );
      setBanner(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBanner();
  }, []);

  // ================= CATEGORY IMAGE =================
  const handleNewImage = (e) => {
    const file = e.target.files[0];
    setNewItem({ ...newItem, imageFile: file });
    setNewPreview(URL.createObjectURL(file));
  };

  // ================= ADD CATEGORY (STRICT 5 RULE) =================
  const handleAddCategory = async () => {

    // empty check
    if (!newItem.category.trim()) {
      return alert("❌ Enter category name");
    }

    // EXACT LIMIT RULE
    if (items.length >= 5) {
      return alert("❌ Only 5 categories allowed. Delete one to add new.");
    }

    try {
      const formData = new FormData();
      formData.append("category", newItem.category);

      if (newItem.imageFile) {
        formData.append("image", newItem.imageFile);
      }

      await axios.post(
        "https://vlux-backend.onrender.com/api/vlux/adminhome/category",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Category Added Successfully");

      setNewItem({ category: "", imageFile: null });
      setNewPreview("");

      fetchCategories();

    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE CATEGORY =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://vlux-backend.onrender.com/api/vlux/adminhome/category/${id}`
      );

      alert("🗑 Category Deleted");
      fetchCategories();

    } catch (err) {
      console.log(err);
    }
  };

  // ================= BANNER FILE =================
  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    setTempBannerPreview(URL.createObjectURL(file));
  };

  // ================= BANNER UPDATE =================
  const handleBannerUpdate = async () => {

    if (!bannerFile) {
      return alert("❌ Select banner image first");
    }

    try {
      const formData = new FormData();
      formData.append("image", bannerFile);

      const res = await axios.post(
        "https://vlux-backend.onrender.com/api/vlux/adminhome/banner",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setBanner(res.data);
      setBannerFile(null);
      setTempBannerPreview("");

      alert("🎉 Banner Updated Successfully");

    } catch (err) {
      console.log(err);
    }
  };

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <>
      <div className={styles.cont}>

        <Helmet>
          <title>Admin Page</title>
        </Helmet>

        <AdminHeader />

        <div className={styles.main}>

          {/* LEFT */}

          <AdminSidebar/>
          

          {/* RIGHT */}
          <div className={styles.right}>

            <h2>Home Page</h2>

            {/* ================= BANNER ================= */}
            <div className={styles.banner}>
              <h2>Banner</h2>

              <div className={styles.bannerimg}>
                <img
                  src={tempBannerPreview || banner?.image || BANNER}
                  alt="banner"
                />
              </div>

              <div className={styles.bannerbtn}>
                <input type="file" onChange={handleBannerFile} />

                <button onClick={handleBannerUpdate}>
                  Update
                </button>
              </div>
            </div>

            {/* ================= CATEGORY ================= */}
            <div className={styles.cat}>
              <h2>Category Management</h2>

              {items.length !== 5 && (
                <p style={{ color: "red" }}>
                  ⚠ You must maintain exactly 5 categories (currently: {items.length})
                </p>
              )}

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Last Updated</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((i) => (
                    <tr key={i._id}>

                      <td>
                        <img src={i.image} width="50" />
                      </td>

                      <td>{i.category}</td>

                      <td>{formatDate(i.updatedAt)}</td>

                      <td>
                        <button onClick={() => handleDelete(i._id)}>
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ================= ADD CATEGORY ================= */}
              <div className={styles.addBox}>

                <input
                  type="text"
                  placeholder="Category name"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      category: e.target.value
                    })
                  }
                />

                <input type="file" onChange={handleNewImage} />

                {newPreview && (
                  <img src={newPreview} width="50" />
                )}

                <button
                  onClick={handleAddCategory}
                  disabled={items.length >= 5}
                >
                  Add Category
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}