import styles from"./Header.module.css"
import LOGO from "../../assests/logo/web_logo.png"

import { Link } from "react-router-dom";

import { FaShoppingCart, FaUser,FaSearch } from "react-icons/fa";


export default function Header(){

    return(


        <div className={styles.cont}>

            <div className={styles.logo}>
                <img src={LOGO} />
                
            </div>

            <div className={styles.nav}>

                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/myorders">My Orders</Link></li>
                    <li><Link to="/contactus">Contact Us</Link></li>
                 </ul>
            </div>


            <div  className={styles.right}>
                
                <Link to="/cartpage"><FaShoppingCart className={styles.cart} /></Link>
                <Link to="/profile"><FaUser className={styles.profile} /></Link>

                
            </div>



        </div>



    );
}