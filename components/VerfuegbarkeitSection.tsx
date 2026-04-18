import AvailabilityCalendar from "./AvailabilityCalendar";
import RevealSection from "./RevealSection";

export default function VerfuegbarkeitSection() {
  return (
    <section className="section verfueg-section" id="verfuegbarkeit">
      <div className="container">
        <RevealSection>
          <p className="s-label">— termine —</p>
        </RevealSection>
        <RevealSection delay={60}>
          <h2 className="s-title">VERFÜGBARKEIT</h2>
        </RevealSection>
        <RevealSection delay={120}>
          <p style={{ fontSize: ".78rem", color: "var(--muted)", marginBottom: "3rem", lineHeight: 1.8 }}>
            Hier siehst du wann FIDDEN noch buchbar ist. Klicke auf einen weißen
            Tag um eine Buchungsanfrage zu stellen.
          </p>
        </RevealSection>
        <AvailabilityCalendar />
      </div>
    </section>
  );
}
