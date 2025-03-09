import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function TermsOfServicePage() {
  return (
    <div className="bg-background">
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="container text-center px-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Terms of Service
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground">
              These Terms of Service constitute a legally binding agreement made
              between you and Tathaastu, a product of Techno Ved IT Solutions,
              concerning your access to and use of our website and services. By
              accessing or using our platform, you agree to be bound by these
              Terms. If you disagree with any part of the terms, you may not
              access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Account Registration
            </h2>
            <p className="text-muted-foreground mb-4">
              To use certain features of our platform, you must register for an
              account. When you register, you agree to provide accurate,
              current, and complete information about yourself and to update
              this information to keep it accurate, current, and complete.
            </p>
            <p className="text-muted-foreground">
              You are responsible for safeguarding the password that you use to
              access our services and for any activities or actions under your
              password. We encourage you to use a strong password and to keep it
              secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Registry Creation and Management
            </h2>
            <p className="text-muted-foreground mb-4">
              Our platform allows you to create and manage gift registries for
              various occasions. By creating a registry, you agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                You will not create registries for illegal, fraudulent, or
                harmful purposes
              </li>
              <li>
                You will not add items that violate any laws or third-party
                rights
              </li>
              <li>
                You are responsible for the accuracy of information in your
                registry
              </li>
              <li>
                We reserve the right to remove any registry or item that
                violates our policies
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Gift Purchases and Transactions
            </h2>
            <p className="text-muted-foreground mb-4">
              When you purchase a gift through our platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                You may be redirected to a third-party retailer to complete your
                purchase
              </li>
              <li>
                Any transaction you engage in with a third-party retailer is
                solely between you and that retailer
              </li>
              <li>
                We are not responsible for issues arising from third-party
                transactions
              </li>
              <li>
                You agree to comply with the terms and policies of any
                third-party retailer
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Intellectual Property
            </h2>
            <p className="text-muted-foreground mb-4">
              The Tathaastu platform, including its content, features, and
              functionality, is owned by Tathaastu and is protected by
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              You may not copy, modify, distribute, sell, or lease any part of
              our services or included software, nor may you reverse engineer or
              attempt to extract the source code of that software, unless laws
              prohibit those restrictions or you have our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Content</h2>
            <p className="text-muted-foreground mb-4">
              Our platform may allow you to post, link, store, share, and
              otherwise make available certain information, text, graphics, or
              other material. By providing User Content, you grant us a
              non-exclusive, transferable, sub-licensable, royalty-free,
              worldwide license to use any such content.
            </p>
            <p className="text-muted-foreground">
              You are responsible for the content you post and agree not to post
              content that is illegal, fraudulent, harmful, obscene, or
              otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, Tathaastu shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from
              your access to or use of or inability to access or use the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever, including without
              limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days' notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed and construed in accordance with the
              laws of India, without regard to its conflict of law provisions.
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <p className="font-medium">Tathaastu</p>
              <p className="text-muted-foreground">
                A product of Techno Ved IT Solutions
              </p>
              <p className="text-muted-foreground">
                Email: legal@tathaastu.org
              </p>
              <p className="text-muted-foreground">
                Address: 91 Springboard, Koramangala, Bengaluru, Karnataka
                560034, India
              </p>
            </div>
          </section>

          <div className="pt-8 border-t">
            <Button variant="outline" asChild>
              <Link to="/privacy">View Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
