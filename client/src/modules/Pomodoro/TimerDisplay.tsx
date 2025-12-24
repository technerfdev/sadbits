import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  CirclePlayIcon,
  PauseCircle,
  PlayIcon,
  StopCircle,
} from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { type PomodoroState } from "./usePomodoro";

export default function TimerDisplay({
  timeLeft,
  state,
  onPause,
  onReset,
  onResume,
}: {
  timeLeft: number;
  state: PomodoroState;
  onPause: () => void;
  onReset: () => void;
  onResume: () => void;
}): JSX.Element {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const [popped, setPopped] = useState<boolean>(false);
  const [showConfirmStop, setShowConfirmStop] = useState<boolean>(false);

  useEffect(() => {
    setPopped(true);
    const t = setTimeout(() => setPopped(false), 160);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const RenderButtons = (): JSX.Element | null => {
    switch (state) {
      case "running":
        return (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onPause}
            data-testid="pause-button"
            aria-label="Pause"
          >
            <PauseCircle />
          </Button>
        );
      case "paused":
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onResume}
              data-testid="resume-button"
              aria-label="Resume"
            >
              <PlayIcon />
            </Button>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => {
                setShowConfirmStop(true);
              }}
              data-testid="stop-button"
              aria-label="stop"
            >
              <StopCircle />
            </Button>
          </div>
        );
      case "stopped":
      default:
        return (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onReset}
            aria-label="Reset"
          >
            <CirclePlayIcon />
          </Button>
        );
    }
  };

  return (
    <>
      <div className="absolute right-4 top-4 z-50">
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-md border transition-colors duration-200 shadow-sm bg-background/60 dark:bg-input/40 border-border/40`}
        >
          <div
            className={`flex flex-col items-start select-none transition-all duration-150 ${
              state === "running" ? "opacity-100" : "opacity-90"
            }`}
          >
            <div
              className={`text-lg md:text-xl font-medium tracking-wide text-foreground transform-gpu transition-transform duration-150 ${
                popped ? "scale-105" : "scale-100"
              }`}
            >
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
            <div className="text-xs text-muted-foreground">Pomodoro</div>
          </div>

          <div className="flex items-center gap-1">
            <RenderButtons />
          </div>
        </div>
      </div>

      <Dialog open={showConfirmStop} onOpenChange={setShowConfirmStop}>
        <DialogContent>
          <div className="p-4">
            <p>Are you sure you want to stop the timer?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmStop(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onReset();
                  setShowConfirmStop(false);
                }}
              >
                Stop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
