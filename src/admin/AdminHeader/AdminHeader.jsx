import styles from "./AdminHeader.module.css"  
import {  FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";





export default function AdminHeader(){


    return(

        <>
        <div className={styles.cont}>

            <div  className={styles.left}>
                <h2>VLUX</h2>
                <p>Admin Pannel</p>
            </div>

            <div className={styles.right}>

                 <div className={styles.rcont}>
                    <FaUser className={styles.imgs} />
                    <p>Admin</p>
                 </div>

                <Link to="/Home" target="_blank"  style={{ textDecoration: "none", color: "inherit" }}>
                 <div className={styles.rcont} >
                    <FaUser className={styles.imgs} />
                    <p>User</p>
                 </div>
                </Link>
            </div>
            

        </div>
        </>





    );
}