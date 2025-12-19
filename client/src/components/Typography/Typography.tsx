import type { PropsWithChildren } from "react";
import type { JSX } from "react/jsx-runtime";

export type LevelType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "caption"
  | "p"
  | "span";

export default function Typography({
  level: Element = "p",
  children,
  ...props
}: PropsWithChildren<{
  level?: LevelType;
  className?: string;
}>): JSX.Element {
  return <Element {...props}>{children}</Element>;
}
