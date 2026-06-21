import React from "react";

const Footer = () => {
    return (
        <footer style={styles.footer}>
            © 2026 MERN E-Learning Platform | MongoDB • Express • React • Node.js
        </footer>
    );
};

const styles = {
    footer: {
        background: "#0f2027",
        textAlign: "center",
        padding: "22px",
        fontSize: "13px",
        color: "#b0c7cf",
    },
};

export default Footer;
