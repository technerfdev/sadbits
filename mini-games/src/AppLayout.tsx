import type { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative w-full h-full">
      <main>{children}</main>
      <div datatest-id="controller" className="controller"></div>
    </div>
  );
}
