import { React } from "react";
import "../styles/Footer.css";



const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <h3>WanderStay</h3>
                    <p>
                        Designed for solo travelers seeking simplicity, saftey and affordability.
                    </p>
                </div>

                <div className="footer-right">
                    <h4>contact us</h4>
                    <p>Email:<a href="mailto:contact@wanderstay.com">contact@wanderstay.com</a></p>
                    <p>Phone: +44 20 7946 0123</p>
                    <p>Location: London, uk</p>

                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} WanderStay. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;