export default function Footer() {
  return (
    <footer className="footer" id="kontakt">
      <div className="footer-contact">
        <p className="footer-contact-label">// KONTAKT</p>
        <a href="mailto:booking@djfidden.de" className="footer-contact-mail">
          booking@djfidden.de
        </a>
        <p className="footer-contact-sub">
          Club Nights · Festivals · Private Events — wir melden uns in 48&nbsp;h.
        </p>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; 2026 DJ <em>FIDDEN</em>
          <br />
          <span className="footer-made">Made with ❤️ in MV</span>
        </div>
        <div className="footer-links">
          <a href="https://www.instagram.com/dj.fidden" target="_blank" rel="noopener noreferrer">
            <svg className="ig-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
            </svg>
            @dj.fidden
          </a>
        </div>
      </div>
    </footer>
  );
}
