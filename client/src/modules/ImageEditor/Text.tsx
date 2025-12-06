import Typography, { type LevelType } from "@/components/Typography/Typography";
import type { JSX } from "react/jsx-runtime";

export interface TextConfig {
  type: LevelType;
  name: string;
  defaultText: string;
}

const textOptions: TextConfig[] = [
  {
    type: "h1",
    name: "Heading 1",

    defaultText: "Heading 1",
  },
  {
    type: "h2",
    name: "Heading 2",

    defaultText: "Heading 2",
  },
  {
    type: "h3",
    name: "Heading 3",

    defaultText: "Heading 3",
  },
  {
    type: "h4",
    name: "Heading 4",

    defaultText: "Heading 4",
  },
  {
    type: "h5",
    name: "Heading 5",

    defaultText: "Heading 5",
  },
  {
    type: "h6",
    name: "Heading 6",

    defaultText: "Heading 6",
  },
  {
    type: "p",
    name: "Paragraph",

    defaultText: "Paragraph text",
  },
  {
    type: "span",
    name: "Normal Text",

    defaultText: "Normal text",
  },
  {
    type: "caption",
    name: "Caption",

    defaultText: "Caption text",
  },
];

interface TextItemProps {
  textConfig: TextConfig;
}

function TextItem({ textConfig }: TextItemProps) {
  const handleDragStart = (e: React.DragEvent) => {
    // e.dataTransfer.setData("text", JSON.stringify(textConfig));
    // e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className="flex flex-col items-start justify-center border rounded-lg p-4 hover:bg-gray-50 cursor-move"
      draggable
      onDragStart={handleDragStart}
    >
      <Typography level={textConfig.type}>{textConfig.defaultText}</Typography>
    </div>
  );
}

export default function Text(): JSX.Element {
  return (
    <div className="flex flex-col overflow-hidden w-full h-full">
      <h2 className="text-xl font-semibold mb-4 px-2">Typography</h2>
      <div className="flex flex-col gap-3 p-2 overflow-auto">
        {textOptions.map((textConfig) => (
          <TextItem key={textConfig.type} textConfig={textConfig} />
        ))}
      </div>
    </div>
  );
}
