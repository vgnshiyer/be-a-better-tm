import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatTime, getTimerColor, getTimerStatus } from "@/lib/timer-utils";
import { Download, Pause, Play, RotateCcw, Save, Trash2 } from "lucide-react";
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

interface TimingRecord {
  id: string;
  speakerName: string;
  timerType: string;
  duration: number;
  colorStatus: 'green' | 'yellow' | 'red' | 'none';
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
  const [customTypeName, setCustomTypeName] = useState("Custom");
  const [speakerName, setSpeakerName] = useState("");
  const [timingRecords, setTimingRecords] = useLocalStorage<TimingRecord[]>('timerRecords', []);
  
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

  const saveRecord = () => {
    if (!speakerName.trim()) {
      alert("Please enter a speaker name");
      return;
    }

    // Determine color status based on current thresholds
    let colorStatus: 'green' | 'yellow' | 'red' | 'none' = 'none';
    if (seconds >= currentConfig.red) {
      colorStatus = 'red';
    } else if (seconds >= currentConfig.yellow) {
      colorStatus = 'yellow';
    } else if (seconds >= currentConfig.green) {
      colorStatus = 'green';
    }

    const newRecord: TimingRecord = {
      id: Date.now().toString(),
      speakerName: speakerName.trim(),
      timerType: selectedPreset === 3 ? customTypeName : timerPresets[selectedPreset].name,
      duration: seconds,
      colorStatus
    };

    setTimingRecords([...timingRecords, newRecord]);
    setSpeakerName("");
    resetTimer();
  };

  const deleteRecord = (id: string) => {
    setTimingRecords(timingRecords.filter(record => record.id !== id));
  };

  const getDurationColor = (colorStatus: 'green' | 'yellow' | 'red' | 'none') => {
    switch (colorStatus) {
      case 'red':
        return "bg-orange-300 dark:bg-orange-800";
      case 'yellow':
        return "bg-yellow-300 dark:bg-yellow-800";
      case 'green':
        return "bg-green-300 dark:bg-green-800";
      default:
        return "";
    }
  };

  const downloadCSV = () => {
    const headers = ['Speaker Name', 'Type', 'Duration'];
    const rows = timingRecords.map(record => [
      record.speakerName,
      record.timerType,
      formatTime(record.duration)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `timer-records-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <CardTitle className="text-2xl font-bold text-card-foreground font-serif">
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
        {/* Left side - Type Selection */}
        <Card className={`transition-opacity duration-300 ${isRunning ? 'opacity-40' : 'opacity-100'}`}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Type
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
                  <Label htmlFor="custom-type-name" className="text-sm">Type Name</Label>
                  <Input
                    id="custom-type-name"
                    type="text"
                    value={customTypeName}
                    onChange={(e) => setCustomTypeName(e.target.value)}
                    placeholder="e.g., Icebreaker, Joke..."
                    className="mt-1"
                  />
                </div>
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
              {selectedPreset === 3 ? customTypeName : timerPresets[selectedPreset].name} Timer
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
              
              {/* Speaker Name Input */}
              <div className="space-y-2">
                <Label htmlFor="speaker-name" className="text-sm">Speaker Name</Label>
                <Input
                  id="speaker-name"
                  value={speakerName}
                  className="bg-card text-card-foreground"
                  onChange={(e) => setSpeakerName(e.target.value)}
                  placeholder="Enter speaker name..."
                  disabled={isRunning}
                  data-testid="input-speaker-name"
                />
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

              <Button 
                onClick={saveRecord}
                className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                variant="outline"
                disabled={isRunning || seconds === 0}
                data-testid="button-save-record"
              >
                <Save className="mr-2 h-5 w-5" />
                Save Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timing Records Table */}
      {timingRecords.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">
                Tracker
              </CardTitle>
              <Button 
                onClick={downloadCSV}
                variant="outline"
                size="sm"
                data-testid="button-download-csv"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="table-responsive overflow-x-auto">
              <table className="w-full border-collapse" data-testid="table-timing-records">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Speaker Name</th>
                    <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Type</th>
                    <th className="border border-border px-3 py-2 text-center text-sm font-semibold">Duration</th>
                    <th className="border border-border px-3 py-2 text-center text-sm font-semibold w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...timingRecords]
                    .sort((a, b) => a.timerType.localeCompare(b.timerType))
                    .map((record) => (
                      <tr key={record.id} data-testid={`row-record-${record.id}`}>
                        <td className="border border-border px-3 py-2">{record.speakerName}</td>
                        <td className="border border-border px-3 py-2">{record.timerType}</td>
                        <td className={`border border-border px-3 py-2 text-center font-mono font-semibold transition-colors ${getDurationColor(record.colorStatus)}`}>
                          {formatTime(record.duration)}
                        </td>
                        <td className="border border-border px-3 py-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRecord(record.id)}
                            className="text-destructive hover:text-destructive/80"
                            data-testid={`button-delete-${record.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </>
  );
};

export default Timer;
