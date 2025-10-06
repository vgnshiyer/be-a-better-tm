import { Card } from "@/components/ui/card";
import {
  Book,
  CheckSquare,
  ClipboardCheck,
  Clock,
  ListChecks,
  Mic
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
      id: 'speech-evaluator',
      name: 'Speech Evaluator',
      description: 'Provide detailed feedback on prepared speeches',
      icon: Mic,
      path: '/speech-evaluator'
    }
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-4" data-testid="role-selection-page">
      <div className="max-w-6xl w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4 font-mono">
            BE-A-BETTER-TM
          </h1>
          <p className="text-lg text-white/80">
            Warning: Don't use this if you enjoy making your life harder.
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
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
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
      
      <footer className="w-full py-6 text-center">
        <p className="text-sm text-white/70 font-semibold font-mono">
          © Designed & vibe-coded by{' '}
          <a 
            href="https://vgnshiyer.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/90 hover:text-white transition-colors"
          >
            vgnshiyer
          </a>
          .
        </p>
      </footer>
    </section>
  );
};

export default RoleSelection;
