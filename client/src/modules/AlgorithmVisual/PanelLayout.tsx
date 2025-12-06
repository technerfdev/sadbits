import type { JSX } from "react";
import type { ProblemStructureType } from "./problemStructure.type";
import ProblemView from "./ProblemView";

export default function PanelLayout({
  problem,
}: {
  problem: ProblemStructureType;
}): JSX.Element {
  return (
    <div data-testid="panel-layout" className="flex">
      <aside className="flex gap-0.5">
        <ProblemView problem={problem} />
      </aside>
      <main className="editor">{/* CodeMirror here */}</main>
      <aside>{/* Tabs allow debugging and Preview (UI) and Debug */}</aside>
    </div>
  );
}
