import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import RoleSelection from "@/pages/role-selection";
import AhCounter from "@/pages/ah-counter";
import Timer from "@/pages/timer";
import Wordmaster from "@/pages/wordmaster";
import Grammarian from "@/pages/grammarian";
import GeneralEvaluator from "@/pages/general-evaluator";
import TableTopics from "@/pages/table-topics";
import Navigation from "@/components/navigation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={RoleSelection} />
      <Route path="/ah-counter" component={AhCounter} />
      <Route path="/timer" component={Timer} />
      <Route path="/wordmaster" component={Wordmaster} />
      <Route path="/grammarian" component={Grammarian} />
      <Route path="/general-evaluator" component={GeneralEvaluator} />
      <Route path="/table-topics" component={TableTopics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navigation />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
