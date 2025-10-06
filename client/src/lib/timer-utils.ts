export interface TimerConfig {
  green: number;
  yellow: number; 
  red: number;
}

export interface TimerState {
  seconds: number;
  isRunning: boolean;
}

export const timerConfigs: Record<string, TimerConfig> = {
  speech: {
    green: 180,  // 3:00
    yellow: 210, // 3:30
    red: 240     // 4:00
  },
  tableTopics: {
    green: 60,   // 1:00
    yellow: 90,  // 1:30
    red: 120     // 2:00
  },
  evaluation: {
    green: 60,   // 1:00
    yellow: 90,  // 1:30
    red: 120     // 2:00
  }
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getTimerColor = (seconds: number, config: TimerConfig): string => {
  if (seconds >= config.red) {
    return 'timer-red';
  } else if (seconds >= config.yellow) {
    return 'timer-yellow';
  } else if (seconds >= config.green) {
    return 'timer-green';
  }
  return '';
};

export const getTimerStatus = (seconds: number, isRunning: boolean, config: TimerConfig): string => {
  if (seconds >= config.red && isRunning) {
    return "Time's up!";
  } else if (isRunning) {
    return 'Running';
  } else if (seconds > 0) {
    return 'Paused';
  }
  return 'Ready';
};
