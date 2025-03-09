import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Award } from "lucide-react";

export default function BrandAmbassadorLogin() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If user is already logged in, check if they're an ambassador
  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        try {
          const { checkBrandAmbassadorStatus } = await import(
            "@/lib/brandAmbassador"
          );
          const isAmbassador = await checkBrandAmbassadorStatus(user.id);

          if (isAmbassador) {
            navigate("/brand-ambassador/dashboard");
          } else {
            navigate("/brand-ambassador", {
              state: {
                message:
                  "You need to enroll in the Brand Ambassador program to access the dashboard.",
              },
            });
          }
        } catch (error) {
          console.error("Error checking ambassador status:", error);
        }
      }
    };

    checkStatus();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error(
            "Invalid email or password. Please check your credentials.",
          );
        }
        throw error;
      }

      // Check if user is a brand ambassador before redirecting
      try {
        const { checkBrandAmbassadorStatus } = await import(
          "@/lib/brandAmbassador"
        );
        const isAmbassador = await checkBrandAmbassadorStatus(user.id);

        if (isAmbassador) {
          navigate("/brand-ambassador/dashboard");
        } else {
          navigate("/brand-ambassador", {
            state: {
              message:
                "You need to enroll in the Brand Ambassador program to access the dashboard.",
            },
          });
        }
      } catch (error) {
        console.error("Error checking ambassador status:", error);
        navigate("/brand-ambassador");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign in",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Award className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Brand Ambassador Portal</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to access your brand ambassador dashboard
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Ambassador Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              Not an ambassador yet?{" "}
              <Link
                to="/brand-ambassador"
                className="text-primary hover:underline"
              >
                Join the program
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
