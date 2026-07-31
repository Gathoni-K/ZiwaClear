import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { db } from "../db";
import { buyers } from "../db/schema";
import { eq, sql } from "drizzle-orm";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: "buyer" | "admin" | "user";
        buyerId?: string;
    };
}

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user || !user.email) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        let role: "buyer" | "admin" | "user" = "user";
        let buyerId: string | undefined;

        const [buyer] = await db.select().from(buyers).where(
            sql`lower(${buyers.contactEmail}) = lower(${user.email})`
        );
        
        if (buyer) {
            role = "buyer";
            buyerId = buyer.id;
        }

        req.user = {
            id: user.id,
            email: user.email,
            role,
            buyerId
        };
        return next();
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error in authentication" });
    }
};

export const requireRole = (roles: ("buyer" | "admin" | "user")[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Forbidden: Insufficient privileges" });
        }
        return next();
    };
};
