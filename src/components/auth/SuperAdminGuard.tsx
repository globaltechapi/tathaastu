import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type SuperAdminGuardProps = {
  children: React.ReactNode;
};

export default function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check for direct admin access via localStorage
  const directAdminAccess = localStorage.getItem("is_super_admin") === "true";

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("is_super_admin")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setIsAdmin(!!data?.is_super_admin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If direct admin access is enabled, allow access
  if (directAdminAccess) {
    return <>{children}</>;
  }

  // Check if user exists
  if (!user) {
    // Redirect to direct admin access page
    return (
      <Navigate
        to="/direct-admin"
        state={{
          from: location,
          message: "Please use direct admin access.",
        }}
        replace
      />
    );
  }

  // Check if the user is a super admin
  if (!isAdmin) {
    // Redirect to direct admin access page
    return (
      <Navigate
        to="/direct-admin"
        state={{
          from: location,
          message: "You need super admin privileges to access this page.",
        }}
        replace
      />
    );
  }

  return <>{children}</>;
}
