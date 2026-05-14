import type { Response, NextFunction } from "express";
import requestIp from "request-ip";
import useragent from "useragent";

export const sessionMetadataMiddleware = (req: any, _res: Response, next: NextFunction) => {
    const clientIp = requestIp.getClientIp(req) || "unknown";
    const agent = useragent.parse(req.headers["user-agent"]);
    
    req.sessionMetadata = {
        ip: clientIp,
        os: agent.os.toString(),
        userAgent: req.headers["user-agent"],
        // Location can be added later using a geoip service if needed
        location: "Unknown", 
    };
    
    next();
};
