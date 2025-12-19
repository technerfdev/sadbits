import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ghost } from "lucide-react";
import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import Pacman from "../MiniGames/Pacman/Pacman";

type GameType = "pacman" | "snake" | "mario" | null;

export default function Entertainment(): JSX.Element {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  if (selectedGame === "pacman") {
    return (
      <div className="min-h-screen bg-background">
        <Button
          onClick={() => setSelectedGame(null)}
          variant="outline"
          className="absolute top-4 left-8 z-10"
        >
          <ArrowLeft />
          Back to Games
        </Button>
        <Pacman />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <Typography className="text-5xl font-bold text-foreground text-center mb-4">
          Mini Games Arcade
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div />
          <div
            onClick={() => setSelectedGame("pacman")}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl transition-all group-hover:bg-yellow-500/20" />
            <div className="relative flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-xl bg-yellow-500/10">
                  <Ghost className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground text-center">
                Pac-Man
              </h2>
            </div>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}
