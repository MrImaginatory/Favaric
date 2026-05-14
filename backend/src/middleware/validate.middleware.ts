import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ZodSchema } from "zod";
import AppError from "../utils/appError.util.js";

/**
 * Middleware to validate request data against a Zod schema.
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Combine all validation errors into a single message
                const message = error.issues
                    .map((issue) => issue.message)
                    .join(", ");
                
                return next(new AppError(message, 400));
            }
            next(error);
        }
    };
};

export default validate;
