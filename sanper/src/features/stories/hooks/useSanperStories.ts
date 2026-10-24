import { useMemo } from "react";

import { mockStories } from "../data/mockStories";

import { useIntelligenceStore } from
  "../../intelligence/store/intelligence.store";

import { selectStoriesWithIntelligence } from
  "../../intelligence/selectors/selectStories";

export function useSanperStories() {
  const records = useIntelligenceStore(
    (state) => state.records,
  );

  return useMemo(
    () =>
      selectStoriesWithIntelligence(
        mockStories,
        records,
      ),
    [records],
  );
}