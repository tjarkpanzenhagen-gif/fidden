import Hero from "@/components/Hero";
import Auftritte from "@/components/Auftritte";
import Gallery from "@/components/Gallery";
import Sounds from "@/components/Sounds";
import VerfuegbarkeitSection from "@/components/VerfuegbarkeitSection";
import Buchung from "@/components/Buchung";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Auftritte />
      <Gallery />
      <Sounds />
      <VerfuegbarkeitSection />
      <Buchung />
      <Footer />
    </main>
  );
}
