import fs from "fs/promises";
import path from "path";
import logger from "./logger.util.js";

/**
 * Renames a file to indicate it has been soft-deleted.
 * Prepend '_deleted_<timestamp>_' to the filename.
 * @param filePath The relative or absolute path to the file.
 * @returns The new file path, or null if it failed.
 */
export const renameDeletedFile = async (filePath: string): Promise<string | null> => {
    try {
        if (!filePath) return null;

        const absolutePath = path.resolve(filePath);
        
        // Check if file exists
        try {
            await fs.access(absolutePath);
        } catch (error) {
            logger.warn(`File not found for renaming: ${absolutePath}`);
            return null;
        }

        const dir = path.dirname(absolutePath);
        const ext = path.extname(absolutePath);
        const baseName = path.basename(absolutePath, ext);

        const newFileName = `_deleted_${Date.now()}_${baseName}${ext}`;
        const newPath = path.join(dir, newFileName);

        await fs.rename(absolutePath, newPath);
        logger.log(`File successfully renamed to: ${newFileName}`);
        
        return newPath;
    } catch (error) {
        logger.error(`Error renaming file ${filePath}: ${error}`);
        return null;
    }
}
