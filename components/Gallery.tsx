import Image from "next/image";
import RevealSection from "./RevealSection";

const photos = [
  { seed: "1047", w: 600, h: 900, tall: true,  label: "28 Jun 2026",  venue: "Helios Club · Rostock" },
  { seed: "1031", w: 600, h: 420, tall: false, label: "Hinter der Bühne", venue: "Vorbereitung" },
  { seed: "1052", w: 600, h: 420, tall: false, label: "Live",          venue: "Open Air" },
  { seed: "1049", w: 600, h: 420, tall: false, label: "Studio",        venue: "Produktion" },
  { seed: "1033", w: 600, h: 900, tall: true,  label: "Porträt",       venue: "SIR FIDDEN 2026" },
  { seed: "1041", w: 600, h: 420, tall: false, label: "12 Jul 2026",   venue: "Klex · Greifswald" },
];

const directions = ["left", "right", "left", "right", "right", "left"] as const;

export default function Gallery() {
  return (
    <section className="section gallery-bg" id="gallery">
      <div className="container">
        <RevealSection from="left"><p className="s-label">— fotos —</p></RevealSection>
        <RevealSection from="left" delay={60}><h2 className="s-title">SHOTS</h2></RevealSection>

        <div className="gallery-grid">
          {photos.map((p, i) => (
            <RevealSection
              key={i}
              from={directions[i]}
              className={p.tall ? "g-item tall" : "g-item"}
              delay={i * 70}
            >
              <Image
                src={`https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}`}
                alt={p.venue}
                width={p.w}
                height={p.h}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
              <div className="g-overlay">
                <div className="g-overlay-label">{p.label}</div>
                <div className="g-overlay-venue">{p.venue}</div>
              </div>
            </RevealSection>
          ))}
        </div>

        <RevealSection from="right" delay={200}>
          <div className="gallery-ig">
            <a href="https://www.instagram.com/dj.fidden" target="_blank" rel="noopener noreferrer">
              ↗ @dj.fidden auf Instagram
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
