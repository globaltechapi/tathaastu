import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`}
      />

      <div className="container mx-auto py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-4">
              At Tathaastu, a product of Techno Ved IT Solutions, we respect
              your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your
              personal data when you visit our website and tell you about your
              privacy rights and how the law protects you.
            </p>
            <p className="text-muted-foreground">
              This privacy policy applies to all users of our platform,
              including registry creators, gift givers, and visitors to our
              website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              We collect several types of information from and about users of
              our website, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Personal identifiers such as name, email address, and contact
                information
              </li>
              <li>Account credentials including username and password</li>
              <li>
                Registry information including items, descriptions, and
                preferences
              </li>
              <li>Transaction data related to gift purchases</li>
              <li>Usage data about how you interact with our website</li>
              <li>Device and browser information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and managing registries</li>
              <li>Sending notifications about registry updates</li>
              <li>Improving our website and user experience</li>
              <li>Communicating with you about your account or registries</li>
              <li>Protecting against fraudulent or unauthorized activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Sharing Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We may share your personal information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Service providers who perform services on our behalf</li>
              <li>
                Registry owners (limited to gift information, not personal
                details)
              </li>
              <li>Third-party retailers for processing gift purchases</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your personal information</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              We have implemented appropriate security measures to prevent your
              personal data from being accidentally lost, used, or accessed in
              an unauthorized way. We limit access to your personal data to
              those employees, agents, contractors, and other third parties who
              have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground">
              We may update our privacy policy from time to time. We will notify
              you of any changes by posting the new privacy policy on this page
              and updating the "Last updated" date at the top of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this privacy policy or our privacy
              practices, please contact us at:
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <p className="font-medium">Tathaastu</p>
              <p className="text-muted-foreground">
                A product of Techno Ved IT Solutions
              </p>
              <p className="text-muted-foreground">
                Email: privacy@tathaastu.org
              </p>
              <p className="text-muted-foreground">
                Address: 91 Springboard, Koramangala, Bengaluru, Karnataka
                560034, India
              </p>
            </div>
          </section>

          <div className="pt-8 border-t">
            <Button variant="outline" asChild>
              <Link to="/terms">View Terms of Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
