import { useCallback, useEffect, useRef } from "react";

export function useAutoResizeTextarea({
  minHeight,
  maxHeight
}: {
  minHeight: number;
  maxHeight: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback((reset?: boolean) => {
    const el = textareaRef.current;
    if (!el) return;
    if (reset) {
      el.style.height = `${minHeight}px`;
      return;
    }
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${Math.max(next, minHeight)}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

