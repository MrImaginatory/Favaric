import crypto from "crypto";
import config from "../configs/constant.config.js";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = Buffer.from(config.SECURITY.SQLITE_ENCRYPTION_KEY, "hex");

/**
 * Encrypts a string using AES-256-GCM
 */
export const encryptData = (text: string): string => {
    if (!text) return text;
    
    // Generate a random 12-byte initialization vector
    const iv = crypto.randomBytes(12);
    
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:encryptedData:authTag
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
};

/**
 * Decrypts a string using AES-256-GCM
 */
export const decryptData = (encryptedText: string): string => {
    if (!encryptedText) return encryptedText;
    
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
        // Handle unencrypted legacy data or malformed strings gracefully
        return encryptedText;
    }
    
    const [ivHex, encryptedHex, authTagHex] = parts;
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
};
