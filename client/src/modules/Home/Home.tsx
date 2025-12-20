import type { JSX } from "react";
import { useEffect, useState } from "react";
import CloudflareAnalytics from "../CloudflareStats/CloudflareStats";
import Weather from "../Weather/Weather";
import HomeCalendar from "./HomeCalendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background border border-border/40">
      <div className="text-4xl font-bold tabular-nums">
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {time.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <div className="grid h-[calc(100vh-6rem)] grid-cols-[auto_1fr] grid-rows-[auto_1fr] overflow-hidden [grid-template-areas:'header_header''sidebar_content']">
      <div className="[grid-area:header] col-span-2 border-b bg-background p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"secondary"}>CF : albertnguyen.com</Button>
          </DialogTrigger>
          <DialogContent>
            <CloudflareAnalytics />
          </DialogContent>
        </Dialog>
      </div>
      <div className="[grid-area:sidebar] overflow-y-auto border-r bg-muted/30 p-4 space-y-4">
        <Clock />
        <Weather />
        <HomeCalendar />
      </div>
      <div className="[grid-area:content] overflow-y-auto p-4"></div>
    </div>
  );
}
