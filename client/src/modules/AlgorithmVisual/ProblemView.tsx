import type { JSX } from "react";
import type { ProblemStructureType } from "./problemStructure.type";

export default function ProblemView({
  problem,
}: {
  problem: ProblemStructureType;
}): JSX.Element {
  return (
    <>
      <section>
        <p>
          <strong>{problem.title}</strong>
        </p>
        <span>{problem.description}</span>
        <span>Difficulty: {problem.difficulty}</span>
      </section>

      {problem.examples?.map((p, idx) => (
        <section key={idx}>
          <p>Input: {p.input}</p>
          <p>Output: {p.output}</p>
          <p>Explanation: {p.explanation}</p>
        </section>
      ))}

      {problem.constraints && problem.constraints?.length > 0 && (
        <section>
          <p>
            <strong>Constraints:</strong>
          </p>
          {problem.constraints?.map((c, idx) => (
            <pre key={idx}>
              <code>{c}</code>
            </pre>
          ))}
        </section>
      )}
    </>
  );
}
