import { useCallback, useRef } from "react";

interface UseDoubleClickOptions {
  onSingleClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLElement>) => void;
  delay?: number;
}

export function useDoubleClick({
  onSingleClick,
  onDoubleClick,
  delay = 300,
}: UseDoubleClickOptions) {
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      clickCountRef.current += 1;

      if (clickCountRef.current === 1) {
        timerRef.current = setTimeout(() => {
          if (clickCountRef.current === 1) {
            onSingleClick?.(e);
          }
          clickCountRef.current = 0;
        }, delay);
      } else if (clickCountRef.current === 2) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        onDoubleClick?.(e);
        clickCountRef.current = 0;
      }
    },
    [onSingleClick, onDoubleClick, delay],
  );

  return { onClick: handleClick };
}
