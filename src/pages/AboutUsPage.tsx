import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AboutUsPage() {
  return (
    <div className="bg-background">
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="container text-center px-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            About Tathaastu
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Our journey, mission, and the team behind the platform
          </p>
        </div>
      </div>

      <div className="container mx-auto py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Our Story
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Tathaastu was born in 2022 when our founders, Arjun and Priya,
              experienced firsthand the challenges of coordinating gift
              registries for both personal celebrations and charitable causes.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              After organizing a wedding registry that simultaneously supported
              an orphanage, they realized there was no platform that seamlessly
              connected individual celebrations with meaningful giving.
            </p>
            <p className="text-lg text-muted-foreground">
              The name "Tathaastu" comes from Sanskrit, meaning "So be it" or
              "May it come true" - reflecting our mission to make wishes come
              true for both celebrants and those in need.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80"
              alt="Children receiving gifts"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            At Tathaastu, we believe that every celebration can be an
            opportunity to make a meaningful difference. Our platform connects
            personal joy with purposeful giving.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Celebrate with Purpose
              </h3>
              <p className="text-muted-foreground text-center">
                Transform personal celebrations into opportunities for
                meaningful impact by connecting gift-giving with charitable
                causes.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m7 10 3 3 7-7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Transparent Giving
              </h3>
              <p className="text-muted-foreground text-center">
                Ensure every contribution makes a real difference with our
                transparent tracking system for both personal and charitable
                registries.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Community Connection
              </h3>
              <p className="text-muted-foreground text-center">
                Build bridges between individuals, organizations, and
                communities through thoughtful and intentional gift-giving.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6 text-center">
            Meet Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
            The passionate individuals behind Tathaastu who are dedicated to
            transforming how we celebrate and give.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=b6e3f4"
                  alt="Arjun Sharma"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Arjun Sharma</h3>
              <p className="text-muted-foreground">Co-Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=ffdfbf"
                  alt="Priya Patel"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Priya Patel</h3>
              <p className="text-muted-foreground">Co-Founder & COO</p>
            </div>
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=vikram&backgroundColor=c0aede"
                  alt="Vikram Reddy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Vikram Reddy</h3>
              <p className="text-muted-foreground">CTO</p>
            </div>
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=meera&backgroundColor=d1d4f9"
                  alt="Meera Krishnan"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Meera Krishnan</h3>
              <p className="text-muted-foreground">Head of Partnerships</p>
            </div>
          </div>
        </div>

        <div className="bg-muted p-8 rounded-lg">
          <h2 className="text-3xl font-semibold tracking-tight mb-6 text-center">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">₹1.2 Cr+</h3>
              <p className="text-muted-foreground">
                Worth of gifts facilitated
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">50+</h3>
              <p className="text-muted-foreground">
                Orphanages & NGOs supported
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">10,000+</h3>
              <p className="text-muted-foreground">Happy users</p>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/create-registry">Start Your Registry</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
