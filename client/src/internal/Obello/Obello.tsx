import { Item, ItemGroup } from "@/components/ui/item";
import Konva from "konva";
import { useState } from "react";
import { Circle, Layer, Stage, Text } from "react-konva";

// Try to replicate the editor using Konva.JS and GSAP

export default function Obello() {
  const [items, setItems] = useState(() =>
    Array.from(new Array(10)).map((_, idx) => ({
      x: Math.random() * 700,
      y: Math.random() * 700,
      id: `node-${idx}`,
      radius: 40,
      color: Konva.Util.getRandomColor(),
    }))
  );

  // Optimize the performance when dragging
  return (
    <div id="container">
      <ItemGroup>
        <Item>Konva.js</Item>
        <Stage id="first-stage" height={700} width={700}>
          <Layer>
            <Text text="First stage" fontSize={16} />
            {items.map((i) => (
              <Circle
                key={i.id}
                name={i.id}
                x={i.x}
                y={i.y}
                fill={i.color}
                radius={i.radius}
                draggable
                onDragStart={(e) => {
                  const copyItems = items.slice();
                  //   find the curreny item in the list via `name` or id
                  const item = copyItems.find((i) => i.id === e.target.name());
                  const itemIdx = copyItems.indexOf(item);
                  //   Remove out the item from the list
                  copyItems.splice(itemIdx, 1);
                  //   push the item to top of the list
                  copyItems.push(item);
                  setItems(copyItems);
                }}
              />
            ))}
          </Layer>
        </Stage>
        <Item>GSAP</Item>
      </ItemGroup>
    </div>
  );
}
