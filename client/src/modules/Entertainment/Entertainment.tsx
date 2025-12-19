import { Button } from "@/components/ui/button";
import { ArrowLeft, Ghost, Hop, Worm } from "lucide-react";
import type { JSX } from "react/jsx-runtime";
import { useState } from "react";
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
          className="absolute top-4 left-4 z-10"
        >
          <ArrowLeft />
          Back to Games
        </Button>
        <Pacman />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-foreground text-center mb-4">
          Mini Games Arcade
        </h1>
        <p className="text-muted-foreground text-center mb-12">
          Choose your favorite classic game and start playing!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <p className="text-muted-foreground text-center text-sm">
                Navigate the maze, eat dots, and avoid ghosts in this classic
                arcade game!
              </p>
              <Button className="w-full" variant="default">
                Play Now
              </Button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 opacity-50 cursor-not-allowed">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
            <div className="relative flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-xl bg-green-500/10">
                  <Worm className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground text-center">
                Snake
              </h2>
              <p className="text-muted-foreground text-center text-sm">
                Guide the snake to eat food and grow longer without hitting
                walls!
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 opacity-50 cursor-not-allowed">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
            <div className="relative flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-xl bg-red-500/10">
                  <Hop className="h-12 w-12 text-red-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground text-center">
                Mario
              </h2>
              <p className="text-muted-foreground text-center text-sm">
                Jump and run through levels in this platformer adventure!
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            Use keyboard controls to play. Have fun!
          </p>
        </div>
      </div>
    </div>
  );
}
