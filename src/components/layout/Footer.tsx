import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Gift,
  Heart,
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();
  const [footerText, setFooterText] = useState(
    "© 2024 Tathaastu. All rights reserved.",
  );

  // State for contact information
  const [contactEmail, setContactEmail] = useState("info@tathaastu.org");
  const [contactPhone, setContactPhone] = useState("+91 98765 43210");
  const [contactAddress, setContactAddress] = useState(
    "91 Springboard, Koramangala, Bengaluru, Karnataka 560034, India",
  );
  const [socialLinks, setSocialLinks] = useState({
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  });

  // Listen for changes to the footer settings in localStorage
  useEffect(() => {
    // Initial load from localStorage
    const loadFooterSettings = () => {
      try {
        const savedSettings = localStorage.getItem("siteSettings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);

          // Update all footer-related settings
          if (settings.footerText) {
            setFooterText(settings.footerText);
          }

          if (settings.contactEmail) {
            setContactEmail(settings.contactEmail);
          }

          if (settings.contactPhone) {
            setContactPhone(settings.contactPhone);
          }

          if (settings.contactAddress) {
            setContactAddress(settings.contactAddress);
          }

          if (settings.socialLinks) {
            setSocialLinks({
              twitter: settings.socialLinks.twitter || "https://twitter.com",
              instagram:
                settings.socialLinks.instagram || "https://instagram.com",
              facebook: settings.socialLinks.facebook || "https://facebook.com",
              linkedin: settings.socialLinks.linkedin || "https://linkedin.com",
            });
          }
        }
      } catch (e) {
        console.error("Error loading footer settings:", e);
      }
    };

    // Load initially
    loadFooterSettings();

    // Set up storage event listener to update when changed in another tab/window or by admin panel
    const handleStorageChange = (e) => {
      if (e.key === "siteSettings") {
        loadFooterSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="w-full mt-auto bg-gradient-to-r from-primary/5 to-purple-500/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto py-16 px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Logo and description */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Tathaastu
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create and share gift registries for personal celebrations,
              orphanages, elderly homes, and NGOs. Connect donors with those who
              need it most.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              A product of{" "}
              <span className="font-medium">Techno Ved IT Solutions</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-base font-semibold mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation("/")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover:w-2 transition-all duration-300"></span>
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/explore")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover:w-2 transition-all duration-300"></span>
                  Explore
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/how-it-works")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover:w-2 transition-all duration-300"></span>
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/about")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover:w-2 transition-all duration-300"></span>
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover:w-2 transition-all duration-300"></span>
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-base font-semibold mb-4 text-foreground">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation("/privacy")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover:w-2 transition-all duration-300"></span>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/terms")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover:w-2 transition-all duration-300"></span>
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-base font-semibold mb-4 text-foreground">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  {contactAddress}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {contactPhone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {contactEmail}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">{footerText}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="flex items-center">
              Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
