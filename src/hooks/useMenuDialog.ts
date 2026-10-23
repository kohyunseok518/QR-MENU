import { useCallback, useEffect, useRef, useState } from "react";
const historyKey = "sodamMenuDialog";

export function useMenuDialog() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const scrollY = useRef(0);
  useEffect(() => {
    if (history.state?.[historyKey]) {
      const state = { ...history.state };
      delete state[historyKey];
      history.replaceState(state, "", location.href);
    }
    const onPop = (event: PopStateEvent) =>
      setSelectedId(
        typeof event.state?.[historyKey] === "string"
          ? event.state[historyKey]
          : null,
      );
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);
  const open = useCallback((id: string) => {
    trigger.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    scrollY.current = window.scrollY;
    history.pushState(
      { ...history.state, [historyKey]: id },
      "",
      location.href,
    );
    setSelectedId(id);
  }, []);
  const close = useCallback(() => {
    if (history.state?.[historyKey]) history.back();
    else setSelectedId(null);
  }, []);
  const restoreFocus = useCallback((event: Event) => {
    event.preventDefault();
    trigger.current?.focus({ preventScroll: true });
    window.scrollTo({ top: scrollY.current, behavior: "auto" });
  }, []);
  return { selectedId, open, close, restoreFocus };
}
