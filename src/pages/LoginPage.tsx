import SignInForm from "@/components/auth/SignInForm";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="container mx-auto px-4">
      {message && (
        <div className="max-w-md mx-auto mt-8">
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </div>
      )}
      <SignInForm />
    </div>
  );
}
