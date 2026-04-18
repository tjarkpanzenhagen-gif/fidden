import RevealSection from "./RevealSection";

export default function Sounds() {
  return (
    <section className="section sounds-bg" id="sounds">
      <div className="container">
        <RevealSection><p className="s-label">— listen —</p></RevealSection>
        <RevealSection delay={60}><h2 className="s-title">SOUNDS</h2></RevealSection>
        <RevealSection delay={120}>
          <div className="sc-wrapper">
            <iframe
              width="100%"
              height="450"
              scrolling="no"
              frameBorder={0}
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/flying-angel-88722887&color=%23ffffff&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
              title="FIDDEN on SoundCloud"
            />
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
