import styles from "./Footer.module.css";
import LOGO from "../../assests/logo/web_logo.png"
import {Link} from "react-router-dom"

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.foot}>
       
       <div className={styles.footimg}>
        <img src={LOGO} alt="" />
       </div>

       <div>
         <h2 className={styles.footh2}>VYLUX LIGHTING</h2>
      <p className={styles.foot2}>Premium LED lighting solutions</p>


      <p className={styles.copy}>
        © 2026 VYLUX Lighting. All rights reserved.
      </p>
       </div>
      </div>

      <div>

        <Link to="/contactus"><button className={styles.footbtn}>Contact Us </button></Link>
      </div>
    </div>
  );
}