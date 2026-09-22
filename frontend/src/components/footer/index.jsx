import "./footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-brand">
                <strong>USOF</strong>
                <span>Built by Rostislav Nikolenko</span>
            </div>
            <div className="footer-links">
                <a
                    href="https://github.com/NikolenkoRostislav"
                    target="_blank"
                    rel="noreferrer"
                >
                    My GitHub
                </a>

                <a
                    href="https://rnikolenko.online/"
                    target="_blank"
                    rel="noreferrer"
                >
                    My Website
                </a>
            </div>
        </footer>
    );
}

export default Footer;