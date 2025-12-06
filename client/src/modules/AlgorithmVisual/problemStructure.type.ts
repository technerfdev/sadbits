export type ProblemDifficulty = "easy" | "medium" | "hard";

export type ProblemStructureType = {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  constraints?: string[];
  hints?: string[];
};
