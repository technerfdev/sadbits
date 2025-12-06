import Typography from "@/components/Typography";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type Konva from "konva";
import {
  ChevronLeftIcon,
  ImageIcon,
  LibraryIcon,
  ShapesIcon,
  TextIcon,
} from "lucide-react";
import { useEffect, useState as useImageState, useRef, useState } from "react";
import {
  Circle,
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  RegularPolygon,
  Stage,
  Star,
  Text,
  Wedge,
} from "react-konva";
import { NavLink } from "react-router-dom";
import Library from "./Library";
import MyImage from "./MyImage";
import TextPage from "./Text";
import Shape, { type ShapeType } from "./Shape";
import { useEditor, type CanvasImage } from "./useEditor";

interface CanvasShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  rotation?: number;
}

// Component to render individual shapes on canvas
function KonvaShape({
  shape,
  onDragStart,
  onDragEnd,
}: {
  shape: CanvasShape;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}) {
  const commonProps = {
    name: shape.id,
    x: shape.x,
    y: shape.y,
    fill: "#b3b3b3",
    draggable: true,
    rotation: shape.rotation || 0,
    ondragstart: onDragStart,
    ondragend: onDragEnd,
  };

  const Shape = () => {
    switch (shape.type) {
      case "rect":
        return (
          <Rect
            {...commonProps}
            width={100}
            height={100}
            offsetX={50}
            offsetY={50}
          />
        );
      case "circle":
        return <Circle {...commonProps} radius={50} />;
      case "star":
        return (
          <Star
            {...commonProps}
            numPoints={5}
            innerRadius={30}
            outerRadius={50}
          />
        );
      case "triangle":
        return <RegularPolygon {...commonProps} sides={3} radius={50} />;
      case "diamond":
        return <RegularPolygon {...commonProps} sides={4} radius={50} />;
      case "pentagon":
        return <RegularPolygon {...commonProps} sides={5} radius={50} />;
      case "hexagon":
        return <RegularPolygon {...commonProps} sides={6} radius={50} />;
      case "right-triangle":
        return (
          <Line
            {...commonProps}
            points={[0, 0, 100, 100, 0, 100]}
            closed
            offsetX={33}
            offsetY={66}
          />
        );
      case "speech-bubble":
        return (
          <Line
            {...commonProps}
            points={[
              20, 0, 120, 0, 120, 80, 80, 80, 60, 110, 50, 80, 20, 80, 20, 0,
            ]}
            closed
            offsetX={70}
            offsetY={55}
          />
        );
      case "plus":
        return (
          <Line
            {...commonProps}
            points={[
              50, 0, 90, 0, 90, 50, 140, 50, 140, 90, 90, 90, 90, 140, 50, 140,
              50, 90, 0, 90, 0, 50, 50, 50,
            ]}
            closed
            offsetX={70}
            offsetY={70}
          />
        );
      case "arrow-right":
        return (
          <Line
            {...commonProps}
            points={[0, 50, 90, 50, 90, 20, 140, 70, 90, 120, 90, 90, 0, 90]}
            closed
            offsetX={70}
            offsetY={70}
          />
        );
      case "arrow-left":
        return (
          <Line
            {...commonProps}
            points={[140, 50, 50, 50, 50, 20, 0, 70, 50, 120, 50, 90, 140, 90]}
            closed
            offsetX={70}
            offsetY={70}
          />
        );
      case "arrow-down":
        return (
          <Line
            {...commonProps}
            points={[50, 0, 50, 90, 20, 90, 70, 140, 120, 90, 90, 90, 90, 0]}
            closed
            offsetX={70}
            offsetY={70}
          />
        );
      case "arrow-up":
        return (
          <Line
            {...commonProps}
            points={[50, 140, 50, 50, 20, 50, 70, 0, 120, 50, 90, 50, 90, 140]}
            closed
            offsetX={70}
            offsetY={70}
          />
        );
      case "pac-man":
        return <Wedge {...commonProps} radius={50} angle={280} rotation={50} />;
      case "cloud":
      case "egg":
      case "flower":
      case "asterisk":
      case "ribbon":
      default:
        return <Circle {...commonProps} radius={50} />;
    }
  };

  return <Shape />;
}

// Component to render images on canvas
function KonvaImageComponent({
  image,
  onDragStart,
  onDragEnd,
}: {
  image: CanvasImage;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}) {
  const [img, setImg] = useImageState<HTMLImageElement | null>(null);
  const imageRef = useRef<any>(null);

  useEffect(() => {
    const imageElement = new window.Image();
    imageElement.src = image.src;
    imageElement.crossOrigin = "anonymous";
    imageElement.onload = () => {
      setImg(imageElement);
    };
  }, [image.src]);

  if (!img) {
    return null;
  }

  return (
    <KonvaImage
      name={image.id}
      ref={imageRef}
      image={img}
      x={image.x}
      y={image.y}
      width={image.width}
      height={image.height}
      draggable
      ondragstart={onDragStart}
      ondragend={onDragEnd}
    />
  );
}

const menu = [
  {
    id: "my-image",
    label: "My Image",
    icon: ImageIcon,
  },
  {
    id: "library",
    label: "Library",
    icon: LibraryIcon,
  },
  {
    id: "shape",
    label: "Shape",
    icon: ShapesIcon,
  },
  {
    id: "text",
    label: "Text",
    icon: TextIcon,
  },
] as const;

const MAPPER = {
  "my-image": MyImage,
  library: Library,
  text: TextPage,
  shape: Shape,
};

export default function ImageEditorLayout() {
  const [view, setView] = useState<"my-image" | "library" | "text" | "shape">(
    "shape"
  );
  const fpsRef = useRef<HTMLDivElement>();
  const {
    elements,
    handleDrop,
    handleDragOver,
    handleDragStartItem,
    handleDragEndItem,
  } = useEditor();

  const Tools = MAPPER[view];

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "3rem",
      }}
    >
      <Sidebar data-testid="img-editor-tools" collapsible="icon" side="left">
        <SidebarHeader>
          <NavLink
            to="/"
            replace
            className="flex gap-0.5 justify-start align-center"
          >
            <SidebarMenuItem>
              <SidebarMenuButton className="cursor-pointer">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ChevronLeftIcon />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <Typography>Back to home</Typography>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </NavLink>
        </SidebarHeader>
        <SidebarContent className="flex items-center">
          <SidebarGroup>
            <SidebarMenu aria-label="Editor Sidebar" className="w-fit">
              {menu.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    onClick={() => setView(id)}
                    className="cursor-pointer"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {<Icon className="w-3" />}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <Typography>{label}</Typography>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div
        data-testid="img-editor-layout"
        className="grid grid-cols-[18rem_1fr] grid-rows-1 flex-1"
      >
        <div className="flex h-full overflow-hidden">
          <Tools />
        </div>
        <div
          data-testid="image-editor-viewer"
          className="flex bg-neutral-500"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mr-auto ml-auto">
            <Stage
              height={600}
              width={800}
              className="bg-background"
              x={0}
              y={0}
            >
              <Layer>
                <Text text={`Length: ${elements.length}`} />
                {elements.map((el) => {
                  switch (el.kind) {
                    case "text":
                    case "shape":
                      return (
                        <KonvaShape
                          key={el.id}
                          shape={el}
                          onDragStart={handleDragStartItem}
                          onDragEnd={handleDragEndItem}
                        />
                      );
                    case "image":
                      return (
                        <KonvaImageComponent
                          key={el.id}
                          image={el}
                          onDragStart={handleDragStartItem}
                          onDragEnd={handleDragEndItem}
                        />
                      );
                    default:
                      null;
                  }
                })}
              </Layer>
            </Stage>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-accent-foreground">
          {/* Show fps */}
          <Stage height={100} width={300}>
            <Layer>
              <Text va />
            </Layer>
          </Stage>
        </div>
      </div>
    </SidebarProvider>
  );
}
