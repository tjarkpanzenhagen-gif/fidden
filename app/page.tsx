import Hero from "@/components/Hero";
import Auftritte from "@/components/Auftritte";
import Sounds from "@/components/Sounds";
import VerfuegbarkeitSection from "@/components/VerfuegbarkeitSection";
import Gallery from "@/components/Gallery";
import Buchung from "@/components/Buchung";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Auftritte />
      <Sounds />
      <VerfuegbarkeitSection />
      <Gallery />
      <Buchung />
      <Footer />
    </main>
  );
}
