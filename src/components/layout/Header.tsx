import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Gift,
  Compass,
  Info,
  Phone,
  Home,
  User,
  Award,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <header className="w-full py-4 px-6 border-b bg-background sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
        >
          Tathaastu
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="group flex items-center text-[1.125rem] font-medium relative overflow-hidden py-2"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors">
              Home
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>

          <Link
            to="/explore"
            className="group flex items-center text-[1.125rem] font-medium relative overflow-hidden py-2"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors">
              Explore
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>

          <Link
            to="/how-it-works"
            className="group flex items-center text-[1.125rem] font-medium relative overflow-hidden py-2"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors">
              How It Works
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>

          <Link
            to="/about"
            className="group flex items-center text-[1.125rem] font-medium relative overflow-hidden py-2"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors">
              About Us
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>

          <Link
            to="/contact"
            className="group flex items-center text-[1.125rem] font-medium relative overflow-hidden py-2"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors">
              Contact
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>

          <Link
            to="/brand-ambassador"
            className="group flex items-center text-[1.125rem] font-medium relative overflow-hidden py-2"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors">
              Brand Ambassador
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "relative h-10 px-4 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/50 hover:border-primary hover:from-primary/30 hover:to-purple-500/30 transition-all",
                    "animate-pulse hover:animate-none",
                  )}
                >
                  <Avatar className="h-6 w-6 mr-2 border border-primary/50">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white">
                      {getInitials(
                        user.user_metadata.name || user.email || "U",
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">
                    {user.user_metadata.name?.split(" ")[0] || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer flex items-center gap-2 py-2"
                >
                  <Link to="/create-registry">
                    <Gift className="h-4 w-4 mr-2" />
                    Create Registry
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer flex items-center gap-2 py-2"
                >
                  <Link to="/my-registries">
                    <Compass className="h-4 w-4 mr-2" />
                    My Registries
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer flex items-center gap-2 py-2"
                >
                  <Link to="/account">
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer py-2 text-destructive focus:text-destructive"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
