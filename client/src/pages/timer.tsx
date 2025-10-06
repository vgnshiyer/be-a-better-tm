import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { timerConfigs, formatTime, getTimerColor, getTimerStatus, TimerState } from "@/lib/timer-utils";

const Timer = () => {
  const [timers, setTimers] = useLocalStorage<Record<string, TimerState>>('timerData', {
    speech: { seconds: 0, isRunning: false },
    tableTopics: { seconds: 0, isRunning: false },
    evaluation: { seconds: 0, isRunning: false }
  });

  const startTimer = (type: string) => {
    if (timers[type]?.isRunning) return;

    const intervalId = setInterval(() => {
      setTimers(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          seconds: prev[type].seconds + 1
        }
      }));
    }, 1000);

    setTimers(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        isRunning: true,
        intervalId
      }
    }));
  };

  const pauseTimer = (type: string) => {
    if (timers[type]?.intervalId) {
      clearInterval(timers[type].intervalId);
    }
    
    setTimers(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        isRunning: false,
        intervalId: undefined
      }
    }));
  };

  const resetTimer = (type: string) => {
    if (timers[type]?.intervalId) {
      clearInterval(timers[type].intervalId);
    }

    setTimers(prev => ({
      ...prev,
      [type]: {
        seconds: 0,
        isRunning: false,
        intervalId: undefined
      }
    }));
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(timers).forEach(timer => {
        if (timer.intervalId) {
          clearInterval(timer.intervalId);
        }
      });
    };
  }, []);

  const TimerCard = ({ 
    type, 
    title, 
    description 
  }: { 
    type: string;
    title: string;
    description: string;
  }) => {
    const timer = timers[type] || { seconds: 0, isRunning: false };
    const config = timerConfigs[type];
    const colorClass = getTimerColor(timer.seconds, config);
    const status = getTimerStatus(timer.seconds, timer.isRunning, config);

    return (
      <Card 
        className={`transition-colors duration-300 ${colorClass ? colorClass : 'bg-card'}`}
        data-testid={`card-timer-${type}`}
      >
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {title}
          </CardTitle>
          <p className="text-sm opacity-80">
            {description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div 
              className="text-6xl font-mono font-bold mb-2"
              data-testid={`display-time-${type}`}
            >
              {formatTime(timer.seconds)}
            </div>
            <div 
              className="text-sm opacity-80"
              data-testid={`status-timer-${type}`}
            >
              {status}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => startTimer(type)}
              className="flex-1"
              data-testid={`button-start-${type}`}
            >
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
            <Button 
              variant="secondary"
              onClick={() => pauseTimer(type)}
              className="flex-1"
              data-testid={`button-pause-${type}`}
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
            <Button 
              variant="destructive"
              onClick={() => resetTimer(type)}
              className="flex-1"
              data-testid={`button-reset-${type}`}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="timer-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground font-serif">
            Timer Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            As the Timer, you are responsible for monitoring and signaling time limits for all speakers. Use the color signals: Green (proceed), Yellow (warning), Red (time's up).
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TimerCard
          type="speech"
          title="Speech Timer"
          description="4 minutes | Green @3:00 | Yellow @3:30 | Red @4:00"
        />
        <TimerCard
          type="tableTopics"
          title="Table Topics Timer"
          description="1-2 minutes | Green @1:00 | Yellow @1:30 | Red @2:00"
        />
        <TimerCard
          type="evaluation"
          title="Evaluation Timer"
          description="1-2 minutes | Green @1:00 | Yellow @1:30 | Red @2:00"
        />
      </div>
    </div>
  );
};

export default Timer;
