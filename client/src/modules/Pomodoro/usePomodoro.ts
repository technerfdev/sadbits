import { useEffect, useState } from "react";

export type PomodoroState = "running" | "paused" | "stopped" | "completed";

export type Session = 25 | 30 | 45 | 60 | 1;

const PERSIST_KEY = "POMODORO_STATE_V1";

export function usePomodoro() {
  const [state, setState] = useState<PomodoroState>("completed");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [session, setSession] = useState<Session>(0.1); // in minutes

  // TODO: calc timeEnd instead of timeLeft
  // When starting, calc timeEnd = now + session * 60
  // On each tick, calc timeLeft = timeEnd - now
  // Persist timeEnd and state

  // TODO: persist state and timeLeft in localStorage or IndexedDB

  useEffect(() => {
    if (state !== "running") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setState("completed");
          clearInterval(id);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [state]);

  return {
    state,
    timeLeft,
    onPause: () => setState("paused"),
    onReset: () => {
      setState("completed");
      setTimeLeft(0);
    },
    onResume: () => setState("running"),
    onStart: () => {
      setState("running");
      setTimeLeft(session * 60);
    },
    onSetSession: (newSession: Session) => setSession(newSession),
  };
}
