import { useCallback, useEffect, useState } from "react";
import type { MenuCatalog, MenuRepository } from "../domain/menu";
import { menuRepository } from "../data/menuRepository";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; catalog: MenuCatalog };

export function useMenuCatalog(repository: MenuRepository = menuRepository) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setState((previous) =>
      previous.status === "ready" ? previous : { status: "loading" },
    );
    repository.getCatalog(controller.signal).then(
      (catalog) => {
        if (!controller.signal.aborted) setState({ status: "ready", catalog });
      },
      () => {
        if (!controller.signal.aborted) setState({ status: "error" });
      },
    );
    return () => controller.abort();
  }, [repository, revision]);
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") reload();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [reload]);
  return { state, reload };
}
