import Hero from "@/components/Hero";
import Auftritte from "@/components/Auftritte";
import VerfuegbarkeitSection from "@/components/VerfuegbarkeitSection";
import Buchung from "@/components/Buchung";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Auftritte />
      <VerfuegbarkeitSection />
      <Buchung />
      <Footer />
    </main>
  );
}
