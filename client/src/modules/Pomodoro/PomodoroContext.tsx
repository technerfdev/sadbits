import {
  createContext,
  useContext,
  useEffect,
  useState,
  type JSX,
} from "react";
import { toast } from "sonner";

export type PomodoroState = "running" | "paused" | "stopped" | "completed";
export type Session = 25 | 30 | 45 | 60 | 1;

interface Task {
  id: string;
  name: string;
}

interface PomodoroContextType {
  state: PomodoroState;
  timeLeft: number;
  session: Session;
  task?: Task;
  timeEnd: number | null;
  onStart: (session: Session, taskId?: string, taskName?: string) => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSetSession: (newSession: Session) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
);

const PERSIST_KEY = "POMODORO_STATE_V1";

const DEFAULT_SESSION_TIME: Session = 25;

export function PomodoroProvider({
  children,
  onComplete,
}: {
  children: React.ReactNode;
  onComplete?: () => void;
}): JSX.Element {
  const [state, setState] = useState<PomodoroState>("completed");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [session, setSession] = useState<Session>(DEFAULT_SESSION_TIME); // in minutes
  const [task, setTask] = useState<Task | undefined>();
  const [timeEnd, setTimeEnd] = useState<number | null>(null);

  useEffect(() => {
    const peristed = localStorage.getItem(PERSIST_KEY);
    if (!peristed) return;

    try {
      const parsed = JSON.parse(peristed);
      setState(parsed.state);
      setTimeEnd(parsed.timeEnd);
      setTask(parsed.task || undefined);

      if (!parsed.timeEnd) return;

      const secLeft = Math.max(
        0,
        Math.ceil(parsed.timeEnd - Date.now() / 1000)
      );
      if (secLeft <= 0 && parsed.state === "running") {
        setState("completed");
        setTimeLeft(0);
        localStorage.removeItem(PERSIST_KEY);
        onComplete?.();
        return;
      }
      setTimeLeft(secLeft);
    } catch (e) {
      console.error("Failed to parse Pomodoro state:", e);
      localStorage.removeItem(PERSIST_KEY);
    }
  }, [onComplete]);

  useEffect(() => {
    if (state !== "running") return;

    const id = setInterval(() => {
      const secLeft = Math.max(
        0,
        Math.ceil(timeEnd ? timeEnd - Date.now() / 1000 : 0)
      );
      setTimeLeft(secLeft);

      if (secLeft === 0) {
        setState("completed");
        setTimeLeft(0);
        localStorage.removeItem(PERSIST_KEY);
        onComplete?.();

        if (task?.name) {
          toast.success(`Pomodoro for "${task.name}" completed!`);
        } else {
          toast.success(`Pomodoro completed!`);
        }
      }
    }, 1000);

    return () => clearInterval(id);
  }, [state, timeEnd, task, onComplete]);

  const value: PomodoroContextType = {
    state,
    timeLeft,
    session,
    task,
    timeEnd,
    onStart: (sessionMinutes: Session, taskId?: string, taskName?: string) => {
      setState("running");
      setTimeLeft(sessionMinutes * 60);
      setSession(sessionMinutes);
      setTask(taskId && taskName ? { id: taskId, name: taskName } : undefined);
      const endTime = Math.ceil(Date.now() / 1000) + sessionMinutes * 60;
      setTimeEnd(endTime);
      localStorage.setItem(
        PERSIST_KEY,
        JSON.stringify({
          state: "running",
          timeEnd: endTime,
          task: taskId && taskName ? { id: taskId, name: taskName } : null,
        })
      );
    },
    onPause: () => setState("paused"),
    onReset: () => {
      setState("completed");
      setTimeLeft(0);
      setTask(undefined);
      setTimeEnd(null);
      localStorage.removeItem(PERSIST_KEY);
    },
    onResume: () => setState("running"),
    onSetSession: (newSession: Session) => setSession(newSession),
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoroContext() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoroContext must be used within PomodoroProvider");
  }
  return context;
}
