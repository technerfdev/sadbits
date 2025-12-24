import { useEffect, useState } from "react";

export type PomodoroState = "running" | "paused" | "stopped" | "completed";

export function usePomodoro() {
  const [state, setState] = useState<PomodoroState>("stopped");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (state === "running" && timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    state,
    timeLeft,
    onPause: () => setState("paused"),
    onReset: () => {
      setState("stopped");
      setTimeLeft(0);
    },
  };
}
