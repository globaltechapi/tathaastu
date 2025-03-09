import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import SampleRegistries from "@/components/home/SampleRegistries";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

export default function HomePage() {
  return (
    <div className="bg-background">
      <Hero />
      <Features />
      <SampleRegistries />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
