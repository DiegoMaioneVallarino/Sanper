import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import { config } from "../config";

/*
 * Protección provisional de acciones editoriales hasta que
 * exista login: header `x-editor-token` igual a EDITOR_TOKEN.
 * Si EDITOR_TOKEN está vacío (desarrollo local) se permite todo.
 */
export const requireEditor: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!config.editorToken) {
    next();
    return;
  }

  if (req.header("x-editor-token") === config.editorToken) {
    next();
    return;
  }

  res.status(401).json({ error: "Se requiere token de editor." });
};

/* Envuelve handlers async para que los errores lleguen a Express. */
export function asyncHandler(
  handler: (req: Request, res: Response) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res).catch(next);
  };
}
