import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { JSX } from "react/jsx-runtime";

export default function CreatePomodoroDialog(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button> Start Pomodoro</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>New session</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
