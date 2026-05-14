import type { Request, Response, NextFunction } from "express";

/**
 * Wraps an async function and passes any errors to the next() middleware.
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;
