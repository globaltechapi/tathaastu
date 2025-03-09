import { useState } from "react";
import { X, HelpCircle, Info, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Step = {
  title: string;
  description: string;
  icon: string;
};

const steps: Step[] = [
  {
    title: "Create an Account",
    description:
      "Start by signing up for a free account on Tathaastu. Enter your name, email address, and create a secure password. Once registered, you'll have access to all features including creating and managing gift registries. Your account also allows you to track donations and receive notifications.",
    icon: "👤",
  },
  {
    title: "Create Your Registry",
    description:
      "Click on 'Create Registry' and select your registry type (personal celebration, orphanage, elderly home, or NGO). Add a title, description, and event date if applicable. Then start adding items - you can add items manually with custom details, prices, and priority levels.",
    icon: "📋",
  },
  {
    title: "Design Invitations",
    description:
      "Create beautiful custom invitations to share with your registry. Choose from a variety of templates, customize colors, fonts, and add your own message. These personalized invitations make sharing your registry more special and engaging for your guests.",
    icon: "🎨",
  },
  {
    title: "Share with Friends",
    description:
      "Once your registry is complete, share it with your network. Use the custom URL to share via email, social media, or messaging apps. You can also use our built-in invitation system to send personalized invitations to friends and family. Track who has viewed your registry and monitor gift purchases in real-time.",
    icon: "🔗",
  },
  {
    title: "Receive Gifts",
    description:
      "When someone purchases an item from your registry, you'll receive an instant notification. The item will be marked as purchased to prevent duplicate gifts. For physical items, donors can arrange delivery directly to your address. For monetary contributions, funds are securely processed and transferred to the appropriate account. You can thank donors directly through the platform.",
    icon: "🎁",
  },
];

export default function OnboardingPopup() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Preload next step content
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 10);
    } else {
      handleClose();
      navigate("/register");
      // Scroll to top of page
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      // Preload previous step content
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
      }, 10);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white"
              >
                <Info className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>How to use Tathaastu</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-primary/20"
            >
              {/* Colorful decorative elements */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/30 rounded-full blur-3xl"></div>
              <div className="absolute top-40 left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-40 right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-full bg-muted/80 hover:bg-muted transition-colors z-10"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-8 relative z-10">
                <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  Welcome to Tathaastu
                </h2>
                <p className="text-center text-muted-foreground mb-8 text-lg">
                  Let's get you started with our gift registry platform
                </p>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full mb-8 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 shadow-lg"
                    style={{
                      width: `${((currentStep + 1) / steps.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Step content */}
                <div className="relative h-80 perspective-1000">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, rotateY: -10, x: 100 }}
                      animate={{ opacity: 1, rotateY: 0, x: 0 }}
                      exit={{ opacity: 0, rotateY: 10, x: -100 }}
                      transition={{
                        type: "tween",
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                    >
                      <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
                        <div className="text-6xl w-28 h-28 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white">
                          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
                            {steps[currentStep].icon}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-gray-600 max-w-md text-sm leading-relaxed bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg shadow-sm border border-blue-100/50">
                        {steps[currentStep].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="relative overflow-hidden group border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M19 12H5"></path>
                      <path d="m12 19-7-7 7-7"></path>
                    </svg>
                    Previous
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="relative overflow-hidden group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all px-6 py-2 h-auto"
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {currentStep === steps.length - 1 ? (
                      <span className="flex items-center gap-1 font-bold">
                        Get Started
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Next
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
