import { BrowserRouter, Routes, Route } from "react-router-dom";

// -------- login/register --------
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// -------- admin --------
import AdminHome from "../admin/AdminHome/AdimHome";
import AdminProduct from "../admin/AdminProduct/AdminProduct";
import AdminViewProduct from "../admin/AdminViewProduct/AdminViewProduct"
import AdminProductEdit from "../admin/AdminProductEdit/AdminProductEdit"
import AdminOrders from "../admin/Adminorders/AdminOrders"
import AdminSettings from "../admin/AdminSettings/AdminSettings"
import AdminDashboard from "../admin/AdminDashboard/AdminDashboard"

// -------- user --------
import Home from "../pages/Home/Home";
import Products from "../pages/Product/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cartpage from "../pages/Cart/Cart"
import Checkout from "../pages/Checkout/Checkout"
import Myorder from "../pages/Myorders/MyOrders"
import Aboutus from "../pages/Aboutus/Aboutus" 
import Profile from "../pages/Profile/Profile"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN */}
        <Route path="/" element={<Login />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cartpage" element={<Cartpage/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/myorders" element={<Myorder/>} />
        <Route path="/contactus" element={<Aboutus/>} />
        <Route path="/profile" element={<Profile/>} />

        
        {/* ✅ PRODUCT DETAILS (IMPORTANT) */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ADMIN */}
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminproducts" element={<AdminProduct />} />
        <Route path="/adminviewproducts" element={<AdminViewProduct />} />
        <Route path="/admin/edit-product/:id" element={<AdminProductEdit />} />
        <Route path="/adminorder" element={<AdminOrders/>} />
        <Route path="/adminsettings" element={<AdminSettings/>} />
        <Route path="/admindashboard" element={<AdminDashboard/>} />


      </Routes>
    </BrowserRouter>
  );
}