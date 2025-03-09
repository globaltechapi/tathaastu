import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { checkBrandAmbassadorStatus } from "@/lib/brandAmbassador";

type BrandAmbassadorGuardProps = {
  children: React.ReactNode;
};

export default function BrandAmbassadorGuard({
  children,
}: BrandAmbassadorGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAmbassador, setIsAmbassador] = useState<boolean | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setCheckingStatus(false);
        return;
      }

      try {
        const status = await checkBrandAmbassadorStatus(user.id);
        setIsAmbassador(status);
      } catch (error) {
        console.error("Error checking ambassador status:", error);
        setIsAmbassador(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    if (!loading) {
      checkStatus();
    }
  }, [user, loading]);

  if (loading || checkingStatus) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, userType: "ambassador" }}
        replace
      />
    );
  }

  if (!isAmbassador) {
    return (
      <Navigate
        to="/brand-ambassador"
        state={{
          message:
            "You need to enroll in the Brand Ambassador program to access this page.",
        }}
        replace
      />
    );
  }

  return <>{children}</>;
}
