import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTime, getTimerColor, getTimerStatus } from "@/lib/timer-utils";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TimerConfig {
  green: number;
  yellow: number;
  red: number;
}

interface TimerPreset {
  name: string;
  description: string;
  config: TimerConfig;
}

const timerPresets: TimerPreset[] = [
  {
    name: "Speech",
    description: "5-7 minutes",
    config: { green: 300, yellow: 360, red: 420 }
  },
  {
    name: "Table Topics",
    description: "1-2 minutes",
    config: { green: 60, yellow: 90, red: 120 }
  },
  {
    name: "Evaluation",
    description: "2-3 minutes",
    config: { green: 120, yellow: 150, red: 180 }
  },
  {
    name: "Custom",
    description: "Set your own times",
    config: { green: 60, yellow: 90, red: 120 }
  }
];

const script = `
  As Timer, I will time the prepared speakers, topics
speakers, and the evaluation. I will also alert each speaker of the time they have left, using the green, yellow, and red cards
(background), which denote specific times remaining.
`;

const Timer = () => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customConfig, setCustomConfig] = useState<TimerConfig>({ green: 60, yellow: 90, red: 120 });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentConfig = selectedPreset === 3 ? customConfig : timerPresets[selectedPreset].config;

  const startTimer = () => {
    if (intervalRef.current) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSeconds(0);
    setIsRunning(false);
  };

  const handlePresetChange = (index: number) => {
    resetTimer();
    setSelectedPreset(index);
  };

  const updateCustomTime = (field: keyof TimerConfig, minutes: number) => {
    setCustomConfig(prev => ({
      ...prev,
      [field]: minutes * 60
    }));
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const colorClass = getTimerColor(seconds, currentConfig);
  const status = getTimerStatus(seconds, isRunning, currentConfig);

  return (
    <>
      {/* Dim overlay when timer is running - covers everything including navbar */}
      {isRunning && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative" data-testid="timer-page">
        <Card className={`mb-6 transition-opacity duration-300 ${isRunning ? 'opacity-40' : 'opacity-100'}`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground font-serif">
              Timer Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {script}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Timer Type Selection */}
        <Card className={`transition-opacity duration-300 ${isRunning ? 'opacity-40' : 'opacity-100'}`}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Timer Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timerPresets.map((preset, index) => (
              <button
                key={preset.name}
                onClick={() => handlePresetChange(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedPreset === index
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                data-testid={`preset-${preset.name.toLowerCase().replace(' ', '-')}`}
              >
                <div className="font-semibold">{preset.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{preset.description}</div>
              </button>
            ))}

            {selectedPreset === 3 && (
              <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label htmlFor="green-time" className="text-sm">Green (minutes)</Label>
                  <Input
                    id="green-time"
                    type="number"
                    min="0"
                    value={customConfig.green / 60}
                    onChange={(e) => updateCustomTime('green', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="yellow-time" className="text-sm">Yellow (minutes)</Label>
                  <Input
                    id="yellow-time"
                    type="number"
                    min="0"
                    step="0.5"
                    value={customConfig.yellow / 60}
                    onChange={(e) => updateCustomTime('yellow', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="red-time" className="text-sm">Red (minutes)</Label>
                  <Input
                    id="red-time"
                    type="number"
                    min="0"
                    value={customConfig.red / 60}
                    onChange={(e) => updateCustomTime('red', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right side - Timer Display */}
        <Card 
          className={`lg:col-span-2 transition-all duration-300 ${isRunning ? 'z-[70] relative pointer-events-auto' : ''} ${colorClass ? colorClass : 'bg-card'}`}
          data-testid="timer-display"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              {timerPresets[selectedPreset].name} Timer
            </CardTitle>
            <p className="text-sm opacity-80">
              Green @ {formatTime(currentConfig.green)} | Yellow @ {formatTime(currentConfig.yellow)} | Red @ {formatTime(currentConfig.red)}
            </p>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[500px]">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <div 
                  className="text-9xl font-mono font-bold mb-4"
                  data-testid="display-time"
                >
                  {formatTime(seconds)}
                </div>
                <div 
                  className="text-2xl opacity-80 font-semibold"
                  data-testid="status-timer"
                >
                  {status}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={startTimer}
                  className="flex-1 h-14 text-lg"
                  disabled={isRunning}
                  data-testid="button-start"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </Button>
                <Button 
                  variant="secondary"
                  onClick={pauseTimer}
                  className="flex-1 h-14 text-lg"
                  disabled={!isRunning}
                  data-testid="button-pause"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
                <Button 
                  variant="destructive"
                  onClick={resetTimer}
                  className="flex-1 h-14 text-lg"
                  data-testid="button-reset"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Timer;
