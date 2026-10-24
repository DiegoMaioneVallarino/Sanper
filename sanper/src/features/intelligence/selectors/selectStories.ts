
import type {
  Story,
} from "../../stories/types/story.types";

import type {
  IntelligenceRecord,
} from "../store/intelligence.store";

export function selectStoriesWithIntelligence(
  stories: Story[],
  records: IntelligenceRecord[],
): Story[] {
  const approved = records.filter(
    (record) =>
      record.decision === "approved" &&
      record.approvedStoryId !== null,
  );

  return stories.map((story) => {
    const related = approved.filter(
      (record) =>
        record.approvedStoryId === story.id,
    );

    if (related.length === 0) {
      return story;
    }

    const articleIds = new Set(
      story.articleIds,
    );

    const sourceIds = new Set(
      story.sourceIds,
    );

    let updatedAt = story.updatedAt;

    for (const record of related) {
      articleIds.add(
        record.result.article.id,
      );

      sourceIds.add(
        record.result.article.sourceId,
      );

      const publishedAt =
        record.result.article.publishedAt;

      if (
        Date.parse(publishedAt) >
        Date.parse(updatedAt)
      ) {
        updatedAt = publishedAt;
      }
    }

    return {
      ...story,
      articleIds: [...articleIds],
      sourceIds: [...sourceIds],
      updatedAt,
    };
  });
}
