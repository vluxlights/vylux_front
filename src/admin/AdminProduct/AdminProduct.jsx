import styles from "./AdminProduct.module.css";
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminSidebar from "../AdminHome/AdminSidebar";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProduct() {

  const [images, setImages] = useState([null, null, null]);
  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [uploadStatus, setUploadStatus] = useState([false, false, false]);

  const [loading, setLoading] = useState(false);
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
    const status = [...uploadStatus];

    prev[index] = URL.createObjectURL(file);
    files[index] = file;
    status[index] = false;

    setImages(prev);
    setImageFiles(files);
    setUploadStatus(status);
  };

  const removeImage = (index) => {
    const prev = [...images];
    const files = [...imageFiles];
    const status = [...uploadStatus];

    prev[index] = null;
    files[index] = null;
    status[index] = false;

    setImages(prev);
    setImageFiles(files);
    setUploadStatus(status);
  };

  const resetAll = () => {
    setImages([null, null, null]);
    setImageFiles([null, null, null]);
    setUploadStatus([false, false, false]);

    setForm({
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
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {

      const validImages = imageFiles.filter(Boolean);

      if (validImages.length !== 3) {
        alert("❌ Please upload ALL 3 images");
        return;
      }

      if (!form.productId || !form.name || !form.price) {
        alert("❌ ProductId, Name, Price required");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      imageFiles.forEach((file) => {
        if (file) formData.append("images", file);
      });

      const res = await axios.post(
        "https://vlux-backend.onrender.com/api/vlux/adminproducts",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (res.data.success) {
        setUploadStatus([true, true, true]);
        alert("✅ Product Added Successfully");
        resetAll();
      } else {
        alert("❌ Failed: " + res.data.message);
      }

    } catch (err) {
      console.log(err);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cont}>
      <Helmet>
        <title>Admin Product</title>
      </Helmet>

      <AdminHeader />
      <div className={styles.main}>
        <AdminSidebar />

        <div className={styles.right}>

          <h2 className={styles.rhead}>Add New Product</h2>
          <p className={styles.rsub}>
            Fill in the product details to add a new product
          </p>

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
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                  />

                  <label htmlFor={`img${index}`} className={index === 0 ? styles.imageInner : styles.smallInner}>
                    {images[index] ? (
                      <img src={images[index]} alt="preview" />
                    ) : (
                      index === 0 ? "Click to upload main image" : `Image ${index + 1}`
                    )}
                  </label>

                  {images[index] && (
                    <button className={styles.deleteBtn} onClick={() => removeImage(index)}>✕</button>
                  )}

                </div>
              ))}
            </div>
          </div>

          {/* ================= BASIC INFO ================= */}
          <div className={styles.basicinfo}>
            <h1 className={styles.h1}>Basic Info</h1>

            <div className={styles.formGrid}>

              <div className={styles.bsinfos}>
                <label>Product Id</label>
                <input placeholder="Enter product ID" name="productId" value={form.productId} onChange={handleChange} />
              </div>

              <div className={styles.bsinfos}>
                <label>Name</label>
                <input placeholder="Enter product name" name="name" value={form.name} onChange={handleChange} />
              </div>

              <div className={styles.bsinfos}>
                <label>Sub Name</label>
                <input placeholder="Enter sub name" name="subName" value={form.subName} onChange={handleChange} />
              </div>

              {/* CATEGORY */}
              <div className={styles.bsinfos}>
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* TYPE */}
              <div className={styles.bsinfos}>
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className={styles.bsinfos}>
                <label>Model Number</label>
                <input placeholder="Enter model number" name="modelNumber" value={form.modelNumber} onChange={handleChange} />
              </div>

              <div className={styles.bsinfos}>
                <label>Warranty</label>
                <input placeholder="Enter warranty" name="warranty" value={form.warranty} onChange={handleChange} />
              </div>

              <div className={styles.bsinfos}>
                <label>Color</label>
                <input placeholder="Enter color" name="color" value={form.color} onChange={handleChange} />
              </div>

            </div>
          </div>

          {/* ================= PRICING ================= */}
          <div className={styles.basicinfo}>
            <h1 className={styles.h1}>Pricing</h1>

            <div className={styles.formGrid}>
              <div className={styles.bsinfos}>
                <label>Price</label>
                <input placeholder="Enter price" name="price" value={form.price} onChange={handleChange} />
              </div>

              <div className={styles.bsinfos}>
                <label>Discount %</label>
                <input placeholder="Enter discount %" name="discountPercentage" value={form.discountPercentage} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ================= TECHNICAL ================= */}
          <div className={styles.basicinfo}>
            <h1 className={styles.h1}>Technical Specs</h1>

            <div className={styles.formGrid}>
              {Object.keys(form)
                .filter(k => !["productId","name","subName","category","type","modelNumber","warranty","color","price","discountPercentage"].includes(k))
                .map((name) => (
                  <div className={styles.bsinfos} key={name}>
                    <label>{name}</label>
                    <input placeholder={`Enter ${name}`} name={name} value={form[name]} onChange={handleChange} />
                  </div>
                ))}
            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className={styles.btnRow}>
            <button className={styles.addBtn} onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>

            <button className={styles.cancelBtn} onClick={resetAll}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}