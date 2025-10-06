import { Button } from "@/components/ui/button";
import { Home, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";

const Navigation = () => {
  const [location, setLocation] = useLocation();
  
  const roleNames: Record<string, string> = {
    "/ah-counter": "Ah-Counter",
    "/timer": "Timer", 
    "/wordmaster": "Wordmaster",
    "/grammarian": "Grammarian",
    "/general-evaluator": "General Evaluator",
    "/table-topics": "Table Topics Master"
  };

  const currentRole = roleNames[location];
  
  const goHome = () => {
    setLocation("/");
  };

  const resetAllData = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (location === "/") {
    return null; // Hide navigation on home page
  }

  return (
    <nav className="bg-card shadow-sm sticky top-0 z-50" data-testid="navigation-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={goHome}
              data-testid="button-home"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <Home className="mr-2 h-4 w-4" />
              Roles
            </Button>
            <span className="text-muted-foreground">|</span>
            <span className="text-lg font-semibold text-foreground" data-testid="text-current-role">
              {currentRole || "Role Tracker"}
            </span>
          </div>
          <div className="nav-actions flex items-center space-x-3">
            <Button 
              variant="destructive" 
              onClick={resetAllData}
              data-testid="button-reset-all-data"
              className="inline-flex items-center px-4 py-2 text-sm font-medium"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
