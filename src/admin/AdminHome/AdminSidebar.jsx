import styles from "./AdminSidebar.module.css";
import {Link} from "react-router-dom"


export default function AdminSidebar() {
  return (
    <div className={styles.left}>
     <Link to="/admindashboard"><button>Dashboard Page</button></Link>
      <Link to="/adminhome"><button>Home Page</button></Link>
      <Link to="/adminproducts"><button>Product Add Page</button></Link>
      <Link to="/adminviewproducts"><button>Product View Page</button></Link>
      <Link to="/adminsettings"><button>Cart Settings</button></Link>
      <Link to="/adminorder"><button>User Order Page</button></Link>
    </div>
  );
}