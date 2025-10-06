import Navigation from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AhCounter from "@/pages/ah-counter";
import GeneralEvaluator from "@/pages/general-evaluator";
import Grammarian from "@/pages/grammarian";
import NotFound from "@/pages/not-found";
import RoleSelection from "@/pages/role-selection";
import SpeechEvaluator from "@/pages/speech-evaluator";
import Timer from "@/pages/timer";
import Wordmaster from "@/pages/wordmaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";

// Get base path from environment
const base = import.meta.env.BASE_URL;

function AppRouter() {
  return (
    <Router base={base}>
      <Switch>
        <Route path="/" component={RoleSelection} />
        <Route path="/ah-counter" component={AhCounter} />
        <Route path="/timer" component={Timer} />
        <Route path="/wordmaster" component={Wordmaster} />
        <Route path="/grammarian" component={Grammarian} />
        <Route path="/general-evaluator" component={GeneralEvaluator} />
        <Route path="/speech-evaluator" component={SpeechEvaluator} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navigation />
          <AppRouter />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
