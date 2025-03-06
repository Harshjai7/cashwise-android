
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import SplashScreen from "./SplashScreen";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [prevPath, setPrevPath] = useState("");
  const [transitionState, setTransitionState] = useState("entered");
  const location = useLocation();

  useEffect(() => {
    // Handle path change animations
    if (prevPath !== location.pathname && prevPath !== "") {
      // Start exit animation
      setTransitionState("exiting");
      
      // After exit animation completes, update state for entry animation
      const timer = setTimeout(() => {
        setTransitionState("entering");
        
        // After entry animation completes, set to entered state
        const enterTimer = setTimeout(() => {
          setTransitionState("entered");
        }, 300);
        
        return () => clearTimeout(enterTimer);
      }, 200);
      
      return () => clearTimeout(timer);
    }
    
    setPrevPath(location.pathname);
  }, [location.pathname, prevPath]);

  // Handle splash screen
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Don't render anything while showing splash screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen pb-16 bg-background">
      <main className={cn(
        "max-w-md mx-auto transition-all duration-300 min-h-[calc(100vh-4rem)]",
        transitionState === "exiting" && "opacity-0 scale-95",
        transitionState === "entering" && "opacity-0 scale-105",
        transitionState === "entered" && "opacity-100 scale-100"
      )}>
        {children}
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;
