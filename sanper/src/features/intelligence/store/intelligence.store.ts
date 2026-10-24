
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  ProcessingResult,
} from "../types/intelligence.types";

export type ReviewDecision =
  | "pending"
  | "approved"
  | "rejected";

export interface IntelligenceRecord {
  id: string;
  result: ProcessingResult;
  decision: ReviewDecision;
  approvedStoryId: string | null;
  reviewedAt: string | null;
}

interface IntelligenceState {
  records: IntelligenceRecord[];

  importResults: (
    results: ProcessingResult[],
  ) => void;

  approve: (
    recordId: string,
    storyId: string,
  ) => void;

  reject: (recordId: string) => void;

  reopen: (recordId: string) => void;

  clearRecords: () => void;
}

export const useIntelligenceStore =
  create<IntelligenceState>()(
    persist(
      (set) => ({
        records: [],

        importResults: (results) =>
          set((state) => {
            const existing = new Set(
              state.records.map(
                (record) => record.id,
              ),
            );

            const incoming = results
              .filter(
                (result) =>
                  !existing.has(result.article.id),
              )
              .map(
                (result): IntelligenceRecord => ({
                  id: result.article.id,
                  result,
                  decision: "pending",
                  approvedStoryId: null,
                  reviewedAt: null,
                }),
              );

            return {
              records: [
                ...state.records,
                ...incoming,
              ],
            };
          }),

        approve: (recordId, storyId) =>
          set((state) => ({
            records: state.records.map(
              (record) =>
                record.id === recordId
                  ? {
                      ...record,
                      decision: "approved",
                      approvedStoryId: storyId,
                      reviewedAt:
                        new Date().toISOString(),
                    }
                  : record,
            ),
          })),

        reject: (recordId) =>
          set((state) => ({
            records: state.records.map(
              (record) =>
                record.id === recordId
                  ? {
                      ...record,
                      decision: "rejected",
                      approvedStoryId: null,
                      reviewedAt:
                        new Date().toISOString(),
                    }
                  : record,
            ),
          })),

        reopen: (recordId) =>
          set((state) => ({
            records: state.records.map(
              (record) =>
                record.id === recordId
                  ? {
                      ...record,
                      decision: "pending",
                      approvedStoryId: null,
                      reviewedAt: null,
                    }
                  : record,
            ),
          })),

        clearRecords: () =>
          set({ records: [] }),
      }),
      {
        name: "sanper-intelligence-v1",
        version: 1,
      },
    ),
  );
