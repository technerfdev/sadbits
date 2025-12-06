import { useEffect } from "react";
import { useIsMobile } from "./useMobile";

/**
 * Not a available on Mobile devices
 */
export function useShortcut(
  keyStrokes: string,
  callback: () => void,
  config?: { disabled?: boolean; metaKey?: "cmd" | "ctrl" }
) {
  const isMac = /Mac/.test(navigator.userAgent);
  const isMobile = useIsMobile();
  const metaKey = config?.metaKey || (isMac ? "cmd" : "ctrl");

  if (isMobile || config?.disabled) {
    return;
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const metaKeyPressed = metaKey === "cmd" ? event.metaKey : event.ctrlKey;
      if (
        event.key.toLowerCase() === keyStrokes.toLowerCase() &&
        metaKeyPressed
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, keyStrokes]);
}
