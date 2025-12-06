import { Card } from "@/components/ui/card";
import type { JSX } from "react";

export default function LongestStringWithoutRepeatingChar(): JSX.Element {
  return (
    <div className="flex gap-3">
      <Card className="w-40 flex wrap-break-word">
        <section>
          <h1>Longest Substring Without Repeating Characters</h1>

          <span>
            Given a string `s``, find the length of the longest substring
            without duplicate characters.
          </span>
        </section>
        <section></section>
      </Card>
      <div className="flex flex-col gap-1">
        <Card></Card>
      </div>
    </div>
  );
}
