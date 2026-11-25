/*
 * Cliente HTTP mínimo para la API de Sanper.
 * VITE_API_URL en .env del frontend; por defecto, local.
 */
export const API_BASE: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const EDITOR_TOKEN: string =
  import.meta.env.VITE_EDITOR_TOKEN ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (EDITOR_TOKEN) {
    headers.set("x-editor-token", EDITOR_TOKEN);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      (body as { error?: string }).error ??
        `Error ${response.status}`,
      response.status,
    );
  }

  return body as T;
}
