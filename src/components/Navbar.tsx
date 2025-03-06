
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleDollarSign, Home, PieChart, Plus, Settings, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  action?: () => void;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems: NavItem[] = [
    {
      icon: <Home size={20} />,
      label: "Home",
      path: "/"
    },
    {
      icon: <PieChart size={20} />,
      label: "Transactions",
      path: "/transactions"
    },
    {
      icon: <Plus size={24} className="text-white" />,
      label: "Add",
      path: "/add"
    },
    {
      icon: <BarChart size={20} />,
      label: "Analytics",
      path: "/analytics"
    },
    {
      icon: <Settings size={20} />,
      label: "Budget",
      path: "/budget"
    }
  ];

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out bg-background border-t border-border",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative flex items-center justify-around max-w-md mx-auto px-4 py-1 h-16">
        {navItems.map((item, index) => (
          <Link 
            key={index}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors duration-200",
              item.path === location.pathname 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={item.action}
          >
            {item.label === "Add" ? (
              <div className="relative flex items-center justify-center w-12 h-12 -mt-6 rounded-full bg-primary shadow-md">
                {item.icon}
              </div>
            ) : (
              <>
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
