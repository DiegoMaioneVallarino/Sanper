import { apiRequest } from "../../../app/api";

import type { Story } from "../../../shared/domain";

export async function fetchStories(): Promise<Story[]> {
  const { stories } = await apiRequest<{ stories: Story[] }>(
    "/api/stories",
  );

  return stories;
}
