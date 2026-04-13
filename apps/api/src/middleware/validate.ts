import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        fields: formatZodErrors(result.error),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        fields: formatZodErrors(result.error),
      });
      return;
    }
    req.query = result.data as typeof req.query;
    next();
  };
}

function formatZodErrors(error: ZodError): Record<string, string> {
  return error.errors.reduce<Record<string, string>>((acc, err) => {
    const key = err.path.join(".") || "value";
    acc[key] = err.message;
    return acc;
  }, {});
}
