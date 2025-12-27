import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CirclePlay,
  CirclePlayIcon,
  InfoIcon,
  Minimize2,
  PauseCircle,
  PlayIcon,
  StopCircle,
} from "lucide-react";
import {
  SessionValue,
  usePomodoroContext,
  type Session,
} from "./PomodoroContext";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PomodoroConfig {
  work: Session;
  shortBreak: Session;
  longBreak: Session;
}

const CONFIG_KEY = "POMODORO_CONFIG";
const DEFAULT_CONFIG: PomodoroConfig = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

const InternalButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="h-16 w-16 rounded-full transform-gpu transition-transform duration-150 active:scale-95 active:translate-y-0.5 motion-reduce:transition-none flex items-center justify-center"
  >
    {children}
  </button>
);

const MIN_CUSTOM_SESSION = 1;

export function PomodoroModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    timeLeft,
    state,
    task,
    session,
    onStart,
    onPause,
    onReset,
    onResume,
  } = usePomodoroContext();
  const [config, setConfig] = useState<PomodoroConfig>(DEFAULT_CONFIG);
  const prevStateRef = useRef<string>(state);
  const prevTimeLeftRef = useRef<number>(timeLeft);

  const [customSession, setCustomSession] = useState<{
    value: string;
    unit: "minutes" | "hours";
  }>({
    value: "1",
    unit: "minutes",
  });

  // Load config
  useEffect(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  // Confetti on completion
  useEffect(() => {
    if (prevStateRef.current === "running" && state === "completed") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    prevStateRef.current = state;
  }, [state]);

  // timer circle animation
  const totalSeconds = session * 60;
  const progress =
    totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 136;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const shouldAnimate =
    state === "running" && prevTimeLeftRef.current !== timeLeft;

  useEffect(() => {
    prevTimeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const RenderButtons = () => {
    switch (state) {
      case "completed":
        return (
          <InternalButton onClick={() => onStart(config.work)}>
            <CirclePlay size={36} />
          </InternalButton>
        );
      case "running":
        return (
          <InternalButton onClick={onPause}>
            <PauseCircle size={36} />
          </InternalButton>
        );
      case "paused":
        return (
          <div className="flex gap-4">
            <InternalButton onClick={onResume}>
              <PlayIcon size={36} />
            </InternalButton>
            <InternalButton onClick={onReset}>
              <StopCircle size={36} />
            </InternalButton>
          </div>
        );
      default:
        return (
          <InternalButton onClick={onReset}>
            <CirclePlayIcon size={36} />
          </InternalButton>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-8" closeIcon={Minimize2}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Pomodoro</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* Timer Circle */}
          <div className="relative w-72 h-72">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 288 288">
              <circle
                cx="144"
                cy="144"
                r="136"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-primary/20"
              />
              <circle
                cx="144"
                cy="144"
                r="136"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary"
                style={{
                  transition: shouldAnimate
                    ? "stroke-dashoffset 1s linear"
                    : "none",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl font-bold text-primary">
                  {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground mt-3">
                  {task?.name || "Pomodoro Session"}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col items-center gap-4">
            <RenderButtons />
          </div>

          <div className="w-full space-y-2">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-left">
                Select Session
              </span>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={18} />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>Min of custom session is 1 minute</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SessionValue.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  onClick={() => onStart(time)}
                  className="transform-gpu transition-transform duration-150 active:scale-95 active:translate-y-0.5 motion-reduce:transition-none"
                >
                  {time}m
                </Button>
              ))}
              <span className="flex gap-1 w-full col-span-2">
                <Input
                  placeholder="min 1"
                  type="number"
                  onChange={(e) =>
                    setCustomSession({
                      ...customSession,
                      value: e.target.value,
                    })
                  }
                  className="flex w-full"
                  min={1}
                />{" "}
                <Select
                  onValueChange={(value) =>
                    setCustomSession({
                      ...customSession,
                      unit: value as "minutes" | "hours",
                    })
                  }
                >
                  <SelectTrigger>
                    {customSession.unit === "minutes" ? "min" : "hour"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">min</SelectItem>
                    <SelectItem value="hours">hour</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    const val = parseInt(customSession.value);
                    if (isNaN(val) || val <= 0) return;
                    const minutes =
                      customSession.unit === "hours" ? val * 60 : val;
                    onStart(minutes as Session);
                  }}
                  className="transform-gpu transition-transform duration-150 active:scale-95 active:translate-y-0.5 motion-reduce:transition-none"
                  disabled={
                    customSession.value === "0" ||
                    customSession.value === "" ||
                    parseInt(customSession.value) <= 0
                  }
                >
                  Start
                </Button>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
