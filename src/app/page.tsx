import Hero from "@/components/home/Hero";
import UseCases from "@/components/home/UseCases";
import Features from "@/components/home/Features";
import Pipeline from "@/components/home/Pipeline";
import Pricing from "@/components/home/Pricing";
import About from "@/components/home/About";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <main className="bg-[#09090b]">
      <Navbar />
      <Hero />
      <UseCases />
      <Pipeline />
      <Features />
      <Pricing />
      <About />
      <Footer/>
    </main>
  );
}
