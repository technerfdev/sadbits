import { useEffect, useState, useCallback } from "react";

export function useKeyboard() {
  const [keys, setKeys] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys((prev) => ({ ...prev, [e.code.toLowerCase()]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys((prev) => ({ ...prev, [e.code.toLowerCase()]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}

export function useMovement() {
  const keys = useKeyboard();

  const isMoving = keys.keyw || keys.keya || keys.keys || keys.keyd;
  const isRunning = keys.shiftleft && isMoving;
  const isWalking = isMoving && !keys.shiftleft;

  return {
    keys,
    isMoving,
    isRunning,
    isWalking,
    forward: keys.keyw,
    backward: keys.keys,
    left: keys.keya,
    right: keys.keyd,
  };
}
