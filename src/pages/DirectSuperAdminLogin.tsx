import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Shield, ArrowLeft } from "lucide-react";

export default function DirectSuperAdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Direct login function that bypasses the normal auth flow
  const handleDirectLogin = async () => {
    setLoading(true);
    try {
      // Create a direct admin session
      const { data, error } = await supabase
        .from("users")
        .update({ is_super_admin: true })
        .eq("email", "admin@tathaastu.com")
        .select();

      if (error) {
        console.error("Error updating admin status:", error);
        throw error;
      }

      // Set a flag in localStorage to indicate admin status
      localStorage.setItem("is_super_admin", "true");

      // Redirect to admin dashboard
      navigate("/admin");
      toast({
        title: "Direct access granted",
        description: "Welcome to the super admin dashboard",
      });
    } catch (error: any) {
      console.error("Direct login error:", error);
      toast({
        title: "Access failed",
        description: error.message || "Could not grant admin access",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="border-primary/20">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Emergency Admin Access
            </CardTitle>
            <CardDescription className="text-center">
              Use this option to bypass normal authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
              <p className="text-sm">
                This is a direct access method that bypasses normal
                authentication. Use only for development or emergency access.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleDirectLogin}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Accessing...
                </>
              ) : (
                "Access Admin Dashboard"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
