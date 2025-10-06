import { Card } from "@/components/ui/card";
import {
  Book,
  CheckSquare,
  ClipboardCheck,
  Clock,
  ListChecks,
  MessageSquare
} from "lucide-react";
import { useLocation } from "wouter";

const RoleSelection = () => {
  const [, setLocation] = useLocation();

  const roles = [
    {
      id: 'ah-counter',
      name: 'Ah-Counter',
      description: 'Track filler words and speech patterns',
      icon: ListChecks,
      path: '/ah-counter'
    },
    {
      id: 'timer',
      name: 'Timer', 
      description: 'Manage speech timings',
      icon: Clock,
      path: '/timer'
    },
    {
      id: 'wordmaster',
      name: 'Wordmaster',
      description: 'Present the word of the day',
      icon: Book,
      path: '/wordmaster'
    },
    {
      id: 'grammarian',
      name: 'Grammarian',
      description: 'Track grammar usage and notable phrases',
      icon: CheckSquare,
      path: '/grammarian'
    },
    {
      id: 'general-evaluator',
      name: 'General Evaluator',
      description: 'Evaluate overall meeting quality',
      icon: ClipboardCheck,
      path: '/general-evaluator'
    },
    {
      id: 'table-topics',
      name: 'Table Topics Master',
      description: 'Manage impromptu speaking sessions',
      icon: MessageSquare,
      path: '/table-topics'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center p-4" data-testid="role-selection-page">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4 font-mono">
            BE A BETTER TOASTMASTER
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your role to begin tracking your meeting responsibilities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id}
                className="p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary"
                onClick={() => setLocation(role.path)}
                data-testid={`card-role-${role.id}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="text-2xl text-primary h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {role.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;
