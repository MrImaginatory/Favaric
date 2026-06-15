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
            const parsedData = schema.parse({
                body: req.body ?? {},
                query: req.query ?? {},
                params: req.params ?? {},
            }) as any;
            if (parsedData.body) req.body = parsedData.body;
            if (parsedData.query) Object.assign(req.query, parsedData.query);
            if (parsedData.params) Object.assign(req.params, parsedData.params);
            
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
