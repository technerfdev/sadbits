import { useMovement } from "@/hooks/useKeyboard";
import { cn } from "@/lib/utils";
import {
  ArrowBigUp,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  SpaceIcon,
} from "lucide-react";
import { type JSX } from "react";
import { Button } from "../ui/button";

export default function KeysPad(): JSX.Element {
  const { keys, forward, backward, left, right } = useMovement();

  return (
    <>
      <div className="absolute bottom-0.5 left-2 justify-center">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <div className="flex flex-1 justify-center items-center ">
              <Button
                aria-label="Up"
                variant="outline"
                className={cn([forward && "bg-amber-200"])}
              >
                <ArrowUpIcon />
              </Button>
            </div>
            <div className="flex gap-1 justify-center items-center">
              <Button
                aria-label="Left"
                variant="outline"
                className={cn([left && "bg-amber-200"])}
              >
                <ArrowLeftIcon />
              </Button>
              <Button
                aria-label="Down"
                variant="outline"
                className={cn([backward && "bg-amber-200"])}
              >
                <ArrowDownIcon />
              </Button>
              <Button
                aria-label="Right"
                variant="outline"
                className={cn([right && "bg-amber-200"])}
              >
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              aria-label="Right"
              variant="outline"
              className={cn([keys.shiftleft && "bg-amber-200"])}
            >
              <ArrowBigUp />
              Shift
            </Button>

            <Button
              aria-label="Right"
              variant="outline"
              className={cn([keys.space && "bg-amber-200"])}
            >
              <SpaceIcon />
              Space
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
