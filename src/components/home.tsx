import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import SampleRegistries from "@/components/home/SampleRegistries";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

function Home() {
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

export default Home;
