import { useEffect, useState } from "react";

export type PomodoroState = "running" | "paused" | "stopped" | "completed";

export type Session = 25 | 30 | 45 | 60 | 1;

const PERSIST_KEY = "POMODORO_STATE_V1";

export function usePomodoro({ onComplete }: { onComplete?: () => void } = {}) {
  const [state, setState] = useState<PomodoroState>("completed");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [session, setSession] = useState<Session>(25); // duration in minutes
  const [timeEnd, setTimeEnd] = useState<number | null>(null);

  const handleComplete = () => {
    setState("completed");
    setTimeLeft(0);
    localStorage.removeItem(PERSIST_KEY);
    onComplete?.();

    // TODO: local notification
  };

  useEffect(() => {
    const peristed = localStorage.getItem(PERSIST_KEY);
    if (!peristed) return;

    try {
      const parsed = JSON.parse(peristed);
      setState(parsed.state);
      setTimeEnd(parsed.timeEnd);
      const secLeft = Math.max(
        0,
        Math.ceil(parsed.timeEnd - Date.now() / 1000)
      );
      if (secLeft <= 0 && parsed.state === "running") {
        handleComplete();
        return;
      }
      setTimeLeft(secLeft);
    } catch (e) {
      localStorage.removeItem(PERSIST_KEY);
    }
  }, []);

  useEffect(() => {
    if (state !== "running") return;
    const id = setInterval(() => {
      const secLeft = Math.max(
        0,
        Math.ceil(timeEnd ? timeEnd - Date.now() / 1000 : 0)
      );
      setTimeLeft(secLeft);

      if (secLeft <= 0) {
        setState("completed");
        localStorage.removeItem(PERSIST_KEY);
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [state]);

  return {
    state,
    timeLeft,
    timeEnd,
    onPause: () => setState("paused"),
    onReset: () => {
      setState("completed");
      setTimeLeft(0);
      setTimeEnd(null);
      localStorage.removeItem(PERSIST_KEY);
    },
    onResume: () => setState("running"),
    onStart: () => {
      const timeEnd = Math.floor(Date.now() / 1000) + session * 60;
      setState("running");
      setTimeEnd(timeEnd);
      setTimeLeft(session * 60);

      localStorage.setItem(
        PERSIST_KEY,
        JSON.stringify({ version: 1, state: "running", timeEnd })
      );
    },
    onSetSession: (newSession: Session) => setSession(newSession),
  };
}
