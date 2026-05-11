import AdminHeader from "../AdminHeader/AdminHeader";
import AdminSidebar from "../AdminHome/AdminSidebar";
import styles from "./AdminHome.module.css";

import BANNER from "../../assests/Home_page/banner.jpeg";

import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminHome() {

  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    category: "",
    imageFile: null
  });

  const [newPreview, setNewPreview] = useState("");

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

    setNewItem({
      ...newItem,
      imageFile: file
    });

    setNewPreview(URL.createObjectURL(file));
  };

  // ================= ADD CATEGORY =================

  const handleAddCategory = async () => {

    if (!newItem.category.trim()) {
      return alert("Enter category");
    }

    if (items.length >= 5) {
      return alert("Only 5 categories allowed");
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
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Category Added");

      setNewItem({
        category: "",
        imageFile: null
      });

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

  // ================= UPDATE BANNER =================

  const handleBannerUpdate = async () => {

    if (!bannerFile) {
      return alert("Select image");
    }

    try {

      const formData = new FormData();

      formData.append("image", bannerFile);

      const res = await axios.post(
        "https://vlux-backend.onrender.com/api/vlux/adminhome/banner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setBanner(res.data);

      setBannerFile(null);

      setTempBannerPreview("");

      alert("Banner Updated");

    } catch (err) {
      console.log(err);
    }
  };

  // ================= DATE =================

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <>
      <Helmet>
        <title>Admin Home</title>
      </Helmet>

      <AdminHeader />

      <div className={styles.layout}>

        {/* SIDEBAR */}

        <AdminSidebar />

        {/* RIGHT */}

        <div className={styles.right}>

          <h1 className={styles.title}>
            Home Page
          </h1>

          {/* ================= BANNER ================= */}

          <div className={styles.card}>

            <h2>Banner</h2>

            <div className={styles.bannerimg}>
              <img
                src={tempBannerPreview || banner?.image || BANNER}
                alt=""
              />
            </div>

            <div className={styles.bannerbtn}>

              <input
                type="file"
                onChange={handleBannerFile}
              />

              <button onClick={handleBannerUpdate}>
                Update Banner
              </button>

            </div>

          </div>

          {/* ================= CATEGORY ================= */}

          <div className={styles.card}>

            <h2>Categories</h2>

            <p className={styles.warning}>
              Current Categories : {items.length}/5
            </p>

            {/* TABLE */}

            <div className={styles.tableWrapper}>

              <table className={styles.table}>

                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Updated</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>

                  {items.map((i) => (

                    <tr key={i._id}>

                      <td>
                        <img
                          src={i.image}
                          alt=""
                        />
                      </td>

                      <td>{i.category}</td>

                      <td>
                        {formatDate(i.updatedAt)}
                      </td>

                      <td>

                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(i._id)}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* ================= ADD CATEGORY ================= */}

            <div className={styles.addBox}>

              <input
                type="text"
                placeholder="Category Name"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    category: e.target.value
                  })
                }
              />

              <input
                type="file"
                onChange={handleNewImage}
              />

              {newPreview && (
                <img
                  src={newPreview}
                  alt=""
                />
              )}

              <button
                onClick={handleAddCategory}
              >
                Add Category
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}