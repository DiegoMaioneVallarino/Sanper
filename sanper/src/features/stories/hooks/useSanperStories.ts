import { useCallback, useEffect, useState } from "react";

import type { Story } from "../../../shared/domain";

import { fetchStories } from "../api/stories.api";
import { mockStories } from "../data/mockStories";

/*
 * Historias desde la API. Si la API no responde
 * (por ejemplo, sin servidor en local), usa las simuladas
 * para que el sitio siga funcionando.
 */
export function useSanperStoriesState() {
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [source, setSource] = useState<"api" | "mock">("mock");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);

    try {
      const fromApi = await fetchStories();
      setStories(fromApi);
      setSource("api");
    } catch {
      setStories(mockStories);
      setSource("mock");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { stories, source, loading, reload };
}

/* Firma original: devuelve sólo la lista. */
export function useSanperStories(): Story[] {
  return useSanperStoriesState().stories;
}
