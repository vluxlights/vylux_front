import styles from "./AdminProductEdit.module.css";
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminSidebar from "../AdminHome/AdminSidebar";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminProductEdit() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([null, null, null]);
  const [imageFiles, setImageFiles] = useState([null, null, null]);

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    name: "",
    subName: "",
    category: "",
    type: "",
    modelNumber: "",
    warranty: "",
    color: "",
    price: "",
    discountPercentage: "",
    powerConsumption: "",
    housingSize: "",
    powerFactor: "",
    thd: "",
    lumens: "",
    colorTemperature: "",
    surgeProtection: "",
    lineFrequency: "",
    ratedVoltage: "",
    operatingVoltage: "",
    cri: "",
    features: "",
    housingMaterial: "",
    baseType: "",
    averageLife: ""
  });

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://vlux-backend.onrender.com/api/vlux/adminproducts/${id}`
        );

        const p = res.data.product;

        setForm({
          productId: p.productId || "",
          name: p.name || "",
          subName: p.subName || "",
          category: p.category || "",
          type: p.type || "",
          modelNumber: p.modelNumber || "",
          warranty: p.warranty || "",
          color: p.color || "",
          price: p.price || "",
          discountPercentage: p.discountPercentage || "",
          powerConsumption: p.powerConsumption || "",
          housingSize: p.housingSize || "",
          powerFactor: p.powerFactor || "",
          thd: p.thd || "",
          lumens: p.lumens || "",
          colorTemperature: p.colorTemperature || "",
          surgeProtection: p.surgeProtection || "",
          lineFrequency: p.lineFrequency || "",
          ratedVoltage: p.ratedVoltage || "",
          operatingVoltage: p.operatingVoltage || "",
          cri: p.cri || "",
          features: p.features || "",
          housingMaterial: p.housingMaterial || "",
          baseType: p.baseType || "",
          averageLife: p.averageLife || ""
        });

        if (p.images) {
          setImages([
            p.images[0]?.url || null,
            p.images[1]?.url || null,
            p.images[2]?.url || null
          ]);
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
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

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const prev = [...images];
    const files = [...imageFiles];

    prev[index] = URL.createObjectURL(file);
    files[index] = file;

    setImages(prev);
    setImageFiles(files);
  };

  const removeImage = (index) => {
    const prev = [...images];
    const files = [...imageFiles];

    prev[index] = null;
    files[index] = null;

    setImages(prev);
    setImageFiles(files);
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    for (let key in form) {
      if (!form[key]) {
        alert(`❌ Please fill ${key}`);
        return false;
      }
    }
    return true;
  };

  // ================= UPDATE PRODUCT =================
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      imageFiles.forEach((file) => {
        if (file) formData.append("images", file);
      });

      const res = await axios.put(
        `https://vlux-backend.onrender.com/api/vlux/adminproducts/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        alert("✅ Product Updated Successfully");
        setEditMode(false);
        navigate("/adminviewproducts");
      } else {
        alert("❌ Update Failed");
      }

    } catch (err) {
      console.log(err);
      alert("❌ Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cont}>

      <Helmet>
        <title>Edit Product</title>
      </Helmet>

      <AdminHeader />

      <div className={styles.main}>
        <AdminSidebar />

        <div className={styles.right}>

          <h2 className={styles.rhead}>Edit Product</h2>
          <p className={styles.rsub}>Update product details</p>

          {/* ================= EDIT BUTTON ================= */}
          {!editMode && (
            <button
              className={styles.addBtn}
              onClick={() => setEditMode(true)}
            >
              Edit Product
            </button>
          )}

          {/* ================= IMAGES ================= */}
          <div className={styles.basicinfo}>
            <h1 className={styles.h1}>Product Images</h1>

            <div className={styles.imageContainer}>

              {[0, 1, 2].map((index) => (
                <div key={index} className={index === 0 ? styles.imageBox : styles.smallBox}>

                  <input
                    type="file"
                    id={`img${index}`}
                    hidden
                    disabled={!editMode}
                    onChange={(e) => handleImageChange(index, e)}
                  />

                  <label
                    htmlFor={`img${index}`}
                    className={index === 0 ? styles.imageInner : styles.smallInner}
                  >
                    {images[index] ? (
                      <img src={images[index]} alt="preview" />
                    ) : (
                      "Upload Image"
                    )}
                  </label>

                  {editMode && images[index] && (
                    <button className={styles.deleteBtn} onClick={() => removeImage(index)}>
                      ✕
                    </button>
                  )}

                </div>
              ))}

            </div>
          </div>

          {/* ================= BASIC INFO ================= */}
          <div className={styles.basicinfo}>
            <h1 className={styles.h1}>Basic Info</h1>

            <div className={styles.formGrid}>

              {[
                "productId",
                "name",
                "subName",
                "category",
                "type",
                "modelNumber",
                "warranty",
                "color"
              ].map((key) => (
                <div className={styles.bsinfos} key={key}>
                  <label>{key}</label>

                  {key === "category" || key === "type" ? (
                    <select
                      name={key}
                      value={form[key]}
                      disabled={!editMode}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={key}
                      value={form[key]}
                      disabled={!editMode}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}

            </div>
          </div>

          {/* ================= PRICING ================= */}
          <div className={styles.basicinfo}>
            <h1 className={styles.h1}>Pricing</h1>

            <div className={styles.formGrid}>
              {["price", "discountPercentage"].map((key) => (
                <div className={styles.bsinfos} key={key}>
                  <label>{key}</label>
                  <input
                    name={key}
                    value={form[key]}
                    disabled={!editMode}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ================= TECH SPECS ================= */}
          <div className={styles.basicinfo}>
            <h1 className={styles.h1}>Technical Specs</h1>

            <div className={styles.formGrid}>

              {[
                "powerConsumption",
                "housingSize",
                "powerFactor",
                "thd",
                "lumens",
                "colorTemperature",
                "surgeProtection",
                "lineFrequency",
                "ratedVoltage",
                "operatingVoltage",
                "cri",
                "features",
                "housingMaterial",
                "baseType",
                "averageLife"
              ].map((key) => (
                <div className={styles.bsinfos} key={key}>
                  <label>{key}</label>
                  <input
                    name={key}
                    value={form[key]}
                    disabled={!editMode}
                    onChange={handleChange}
                  />
                </div>
              ))}

            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          {editMode && (
            <div className={styles.btnRow}>

              <button
                className={styles.addBtn}
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>

              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setEditMode(false);
                  navigate("/adminviewproducts");
                }}
              >
                Cancel
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}