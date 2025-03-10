import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Award,
  Gift,
  Users,
  Megaphone,
  ShoppingBag,
  CheckCircle,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function BrandAmbassadorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const location = useLocation();
  const message = location.state?.message;

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    tshirtSize: "M",
    reason: "",
  });

  useEffect(() => {
    const checkAmbassadorStatus = async () => {
      if (!user) {
        setCheckingStatus(false);
        return;
      }

      try {
        const { checkBrandAmbassadorStatus } = await import(
          "@/lib/brandAmbassador"
        );
        const status = await checkBrandAmbassadorStatus(user.id);
        setIsAmbassador(status);
      } catch (error) {
        console.error("Error checking ambassador status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkAmbassadorStatus();
  }, [user]);

  useEffect(() => {
    if (message) {
      toast({
        title: "Access Restricted",
        description: message,
        variant: "destructive",
      });
    }
  }, [message, toast]);

  // If user is already an ambassador, redirect to dashboard
  useEffect(() => {
    if (isAmbassador) {
      navigate("/brand-ambassador/dashboard");
    }
  }, [isAmbassador, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description:
          "Please login before enrolling in the Brand Ambassador program.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/brand-ambassador" } });
      return;
    }

    setIsEnrolling(true);

    // Initialize Razorpay payment
    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // Razorpay test key
      amount: 199900, // Amount in paise (₹1,999)
      currency: "INR",
      name: "Tathaastu",
      description: "Brand Ambassador Program Enrollment",
      image:
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=100&q=80", // Logo URL
      handler: async function (response: any) {
        console.log(
          "Payment successful with ID:",
          response.razorpay_payment_id,
        );
        try {
          // Payment successful
          console.log("Payment ID: " + response.razorpay_payment_id);

          // Create brand ambassador record
          const { createBrandAmbassador } = await import(
            "@/lib/brandAmbassador"
          );
          const success = await createBrandAmbassador(
            user.id,
            response.razorpay_payment_id,
            formData,
          );

          if (success) {
            toast({
              title: "Enrollment Successful!",
              description:
                "Welcome to the Tathaastu Brand Ambassador Program. Your kit will be shipped within 7 business days.",
            });

            // Redirect to ambassador dashboard
            navigate("/brand-ambassador/dashboard");
          } else {
            toast({
              title: "Enrollment Error",
              description:
                "There was an issue with your enrollment. Please contact support.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error creating brand ambassador:", error);
          toast({
            title: "Enrollment Error",
            description:
              "There was an issue with your enrollment. Please contact support.",
            variant: "destructive",
          });
        } finally {
          setIsEnrolling(false);
          setPaymentOpen(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#6366f1",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal dismissed");
          setIsEnrolling(false);
        },
      },
      notes: {
        address: "Tathaastu Headquarters, Bangalore",
      },
      retry: {
        enabled: true,
        max_count: 3,
      },
    };

    // Open Razorpay payment form
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  const benefits = [
    {
      icon: <Gift className="h-10 w-10 text-primary" />,
      title: "Ambassador Kit",
      description:
        "Receive a premium kit with branded T-shirt, cap, marketing materials, and digital assets.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Create Impact",
      description:
        "Create and manage gift registries for orphanages, elderly homes, and NGOs in your community.",
    },
    {
      icon: <Megaphone className="h-10 w-10 text-primary" />,
      title: "Campaign Management",
      description:
        "Access to exclusive tools to run and track your social impact campaigns.",
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Recognition",
      description:
        "Get featured on our platform and receive certificates for your social impact work.",
    },
  ];

  const kitItems = [
    {
      name: "Premium Tathaastu T-shirt",
      description: "High-quality cotton with embroidered logo",
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
    },
    {
      name: "Branded Cap",
      description: "Adjustable size with embroidered logo",
      image:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80",
    },
    {
      name: "Marketing Materials",
      description: "Brochures, flyers, and business cards",
      image:
        "https://images.unsplash.com/photo-1606676539940-12768ce0e762?w=400&q=80",
    },
    {
      name: "Digital Asset Pack",
      description: "Social media templates and email signatures",
      image:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80",
    },
  ];

  const testimonials = [
    {
      quote:
        "Being a Brand Ambassador for Tathaastu has allowed me to make a real difference in my community. I've helped three local orphanages get the supplies they desperately needed.",
      name: "Vikram Singh",
      location: "Mumbai",
      image:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram&backgroundColor=b6e3f4",
    },
    {
      quote:
        "The ambassador program gave me the tools and platform to connect donors with elderly homes in my city. The impact has been incredible, and I feel proud to be part of this movement.",
      name: "Meera Desai",
      location: "Bangalore",
      image:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=meera&backgroundColor=ffdfbf",
    },
    {
      quote:
        "I've always wanted to help local NGOs but didn't know how. The Tathaastu platform and ambassador program made it simple to create meaningful campaigns that actually deliver results.",
      name: "Arjun Kapoor",
      location: "Delhi",
      image:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=c0aede",
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container text-center px-6 relative z-10">
          <Badge className="mb-4 bg-white/90 text-primary hover:bg-white/80 py-1.5 px-4 text-sm">
            Join Our Movement
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 drop-shadow-sm">
            Become a Tathaastu Brand Ambassador
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create meaningful impact in your community by connecting donors with
            those who need it most. Join our network of passionate
            change-makers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  disabled={isAmbassador || checkingStatus}
                >
                  {isEnrolling ? "Processing..." : "Enroll Now for ₹1,999"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
                <div>
                  <div className="p-6">
                    <DialogHeader className="mb-2">
                      <DialogTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Enroll as Brand Ambassador
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        Complete your details to join the program for ₹1,999
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEnroll} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 border-primary/20 focus-visible:ring-primary/30"
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 border-primary/20 focus-visible:ring-primary/30"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 border-primary/20 focus-visible:ring-primary/30"
                          placeholder="Your mobile number"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium"
                        >
                          Shipping Address
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="mt-1 min-h-[60px] border-primary/20 focus-visible:ring-primary/30"
                          placeholder="Your complete shipping address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-sm font-medium">
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="mt-1 border-primary/20 focus-visible:ring-primary/30"
                            placeholder="Your city"
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="state"
                            className="text-sm font-medium"
                          >
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="mt-1 border-primary/20 focus-visible:ring-primary/30"
                            placeholder="Your state"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="pincode"
                            className="text-sm font-medium"
                          >
                            PIN Code
                          </Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="mt-1 border-primary/20 focus-visible:ring-primary/30"
                            placeholder="6-digit PIN code"
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="tshirtSize"
                            className="text-sm font-medium"
                          >
                            T-Shirt Size
                          </Label>
                          <select
                            id="tshirtSize"
                            name="tshirtSize"
                            value={formData.tshirtSize}
                            onChange={handleInputChange}
                            className="flex h-10 w-full mt-1 rounded-md border border-primary/20 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="S">Small</option>
                            <option value="M">Medium</option>
                            <option value="L">Large</option>
                            <option value="XL">X-Large</option>
                            <option value="XXL">XX-Large</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-3">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setPaymentOpen(false)}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isEnrolling}
                          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        >
                          {isEnrolling ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing Payment...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center font-medium text-base">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <circle cx="12" cy="8" r="7"></circle>
                                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                              </svg>
                              Pay ₹1,999 & Enroll Now
                            </span>
                          )}
                        </Button>
                      </div>

                      <p className="text-xs text-center text-muted-foreground">
                        By enrolling, you agree to our{" "}
                        <Link
                          to="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {isAmbassador ? (
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                asChild
              >
                <Link to="/brand-ambassador/dashboard">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Go to Ambassador Dashboard
                </Link>
              </Button>
            ) : null}
            {!user ? (
              <Button size="lg" variant="outline" asChild>
                <Link to="/login" state={{ userType: "ambassador" }}>
                  Ambassador Login
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/account")}
              >
                Account Settings
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Benefits of Becoming a Brand Ambassador
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our program and receive exclusive benefits while making a
              real difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-card border hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ambassador Kit Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Your Ambassador Kit
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Receive a premium kit with everything you need to represent
              Tathaastu in your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {kitItems.map((item, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 w-full relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-background p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Free Shipping Across India</h3>
                  <p className="text-sm text-muted-foreground">
                    Your kit will be delivered within 7 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our program in three simple steps and start making an impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 right-6 h-full w-px bg-border hidden md:block"></div>
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4 relative z-10">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Enroll in the Program
              </h3>
              <p className="text-muted-foreground mb-4">
                Complete the enrollment form and pay the one-time fee of ₹1,999
                to join the program.
              </p>
              {isAmbassador ? (
                <Button variant="outline" size="sm" className="group" asChild>
                  <Link to="/brand-ambassador/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="group"
                  onClick={() => setPaymentOpen(true)}
                  disabled={checkingStatus}
                >
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="absolute top-0 right-6 h-full w-px bg-border hidden md:block"></div>
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4 relative z-10">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Your Kit</h3>
              <p className="text-muted-foreground mb-4">
                Your ambassador kit will be shipped to your address within 7
                business days of enrollment.
              </p>
              <Button variant="outline" size="sm" className="group">
                View Kit Details
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4 relative z-10">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Impact</h3>
              <p className="text-muted-foreground mb-4">
                Start creating and managing gift registries for organizations in
                your community.
              </p>
              <Button variant="outline" size="sm" className="group" asChild>
                <Link to="/login" state={{ userType: "ambassador" }}>
                  Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Meet Our Brand Ambassadors
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from people who are already making a difference in their
              communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.location}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="italic text-muted-foreground">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about the Brand Ambassador Program.
            </p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="program">Program Details</TabsTrigger>
              <TabsTrigger value="payment">Payment & Kit</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    What is the Tathaastu Brand Ambassador Program?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The Tathaastu Brand Ambassador Program is an initiative that
                    empowers individuals to create meaningful impact in their
                    communities by connecting donors with orphanages, elderly
                    homes, and NGOs through our gift registry platform.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Who can become a Brand Ambassador?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Anyone who is passionate about making a difference in their
                    community can become a Brand Ambassador. We welcome
                    students, professionals, social workers, and anyone with a
                    desire to create positive change.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    What are the responsibilities of a Brand Ambassador?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Brand Ambassadors are responsible for identifying and
                    connecting with local organizations, helping them create
                    gift registries, promoting these registries within their
                    networks, and ensuring the smooth delivery of donated items.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="program" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    How long is the Brand Ambassador term?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The initial term is for one year, after which you can renew
                    your ambassadorship. There is no renewal fee for ambassadors
                    who have successfully managed at least three campaigns
                    during their term.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    How many organizations can I work with?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    There is no limit to the number of organizations you can
                    work with. You can create and manage as many gift registries
                    as you want for different organizations in your community.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Do I receive any compensation?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    While this is primarily a social impact program, ambassadors
                    who reach certain milestones receive recognition,
                    certificates, and opportunities to participate in exclusive
                    events. Top-performing ambassadors may also be eligible for
                    special rewards.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payment" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    What does the ₹1,999 fee cover?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The one-time fee covers your ambassador kit (T-shirt, cap,
                    marketing materials), access to exclusive ambassador tools
                    on the platform, training resources, and shipping charges
                    across India.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    When will I receive my Ambassador Kit?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your kit will be shipped within 3 business days after
                    enrollment and typically arrives within 7 business days,
                    depending on your location. You'll receive a tracking number
                    once your kit is dispatched.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Is there a refund policy?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We offer a 7-day refund policy from the date of enrollment,
                    provided the ambassador kit has not been shipped. Once the
                    kit is shipped, the fee is non-refundable.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/20 to-purple-500/20">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Ready to Make a Difference in Your Community?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our network of Brand Ambassadors today and start creating
              meaningful impact through the power of gift registries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAmbassador ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  asChild
                >
                  <Link to="/brand-ambassador/dashboard">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Go to Ambassador Dashboard
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  onClick={() => setPaymentOpen(true)}
                  disabled={checkingStatus}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Enroll Now for ₹1,999
                </Button>
              )}
              {!user ? (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login" state={{ userType: "ambassador" }}>
                    Ambassador Login
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/account")}
                >
                  Account Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
