import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  CirclePlayIcon,
  PauseCircle,
  PlayIcon,
  StopCircle,
} from "lucide-react";
import { useState, type JSX } from "react";
import { usePomodoroContext } from "./PomodoroContext";

export default function TimerDisplay(): JSX.Element {
  const { timeLeft, state, task, onStart, onPause, onReset, onResume } =
    usePomodoroContext();

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

  return (
    <>
      <div className="absolute right-4 top-4 z-50">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors duration-200 shadow-sm bg-background/60 dark:bg-input/40 border-border/40`}
        >
          {/* Timer display */}
          <div
            className={`text-center select-none transition-all duration-150 text-ellipsis overflow-hidden max-w-[150px] block whitespace-nowrap ${
              state === "running" ? "opacity-100" : "opacity-90"
            }`}
          >
            <div className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </div>
            <span className="text-xs text-muted-foreground mt-0.5">
              {task?.name ? task.name : "Pomodoro"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <RenderButtons />
          </div>
        </div>
      </div>

      <Dialog open={showConfirmStop} onOpenChange={setShowConfirmStop}>
        <DialogContent>
          <>
            <p>Are you sure you want to stop the timer?</p>
            <div className="flex justify-end gap-2 mt-1">
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
          </>
        </DialogContent>
      </Dialog>
    </>
  );
}
