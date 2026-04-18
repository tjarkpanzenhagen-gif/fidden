import AvailabilityCalendar from "@/components/AvailabilityCalendar";

export const metadata = { title: "Verfügbarkeit — DJ FIDDEN" };

export default function VerfuegbarkeitPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <p className="s-label">— termine —</p>
        <h1 className="s-title">VERFÜGBARKEIT</h1>
        <p style={{ fontSize: ".78rem", color: "var(--muted)", marginBottom: "3rem", lineHeight: 1.8 }}>
          Hier siehst du wann FIDDEN noch buchbar ist. Klicke auf einen weißen Tag
          um eine Anfrage zu stellen.
        </p>
        <AvailabilityCalendar />
      </div>
    </div>
  );
}
