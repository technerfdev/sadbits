import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  CirclePlayIcon,
  PauseCircle,
  PlayIcon,
  StopCircle,
} from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { usePomodoro, type PomodoroState } from "./usePomodoro";

export interface TimerDisplayProps {
  timeLeft: number;
  state: PomodoroState;
  onPause: () => void;
  onReset: () => void;
  onResume: () => void;
}

export default function TimerDisplay(): JSX.Element {
  const { timeLeft, state, onStart, onPause, onReset, onResume } =
    usePomodoro();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const [showConfirmStop, setShowConfirmStop] = useState<boolean>(false);

  const RenderButtons = (): JSX.Element | null => {
    switch (state) {
      case "completed":
        return (
          <Button
            variant={"outline"}
            size={"icon-lg"}
            onClick={onStart}
            aria-label="Reset"
          >
            <CirclePlayIcon />
          </Button>
        );
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

  useEffect(() => {
    if (minutes === 0 && seconds === 0 && state === "running") {
      // Timer completed
      debugger;
    }
  }, [minutes, seconds]);

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
              className={`text-lg md:text-xl font-medium tracking-wide text-foreground transform-gpu transition-transform duration-150  `}
            >
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
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
