import { useEffect, useState } from "react";

export function useTimer(startSeconds: number = 0) {
  const [seconds, setSeconds] = useState(startSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => setSeconds(0);
  const toggle = () => isRunning ? stop() : start()

  return { seconds, start, stop, reset, toggle, isRunning };
}