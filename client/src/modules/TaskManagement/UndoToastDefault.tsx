import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const DELETE_TASK_TIMEOUT = 3000;
const UNDO_INTERVAL = 100;

interface UndoToastDefaultProps {
  timeout?: number;
  onUndo: () => void;
}

export function UndoToastDefault({
  timeout = DELETE_TASK_TIMEOUT,
  onUndo,
}: UndoToastDefaultProps) {
  const [timeLeft, setTimeLeft] = useState(timeout);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return prev - UNDO_INTERVAL;
      });

      setProgress((prev) => {
        const newProgress = prev - (UNDO_INTERVAL / timeout) * 100;
        return newProgress > 0 ? newProgress : 0;
      });
    }, UNDO_INTERVAL);

    return () => clearInterval(interval);
  }, [timeout]);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-1.5">Task deleted</p>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="text-2xl text-muted-foreground font-mono tabular-nums min-w-[2rem] text-center shrink-0">
        {Math.ceil(timeLeft / 1000)}
      </span>
      <Button size="sm" variant="secondary" onClick={onUndo} className="shrink-0">
        Undo
      </Button>
    </div>
  );
}
