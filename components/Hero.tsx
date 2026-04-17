import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg-glow" />
      <div className="hero-content">
        <p className="hero-pre">— Sir Fidden —</p>
        <span className="hero-logo">FIDDEN</span>
        <p className="hero-subtitle">
          DJ &middot; Producer &middot; Club Culture
          <span className="blink" />
        </p>
        <div className="hero-cta">
          <Link href="#buchung" className="btn">[ Book Now ]</Link>
        </div>
      </div>
      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
