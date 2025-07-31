import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/NotFoundError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }

  return res.status(500).json({ error: "Something went wrong" });
}
