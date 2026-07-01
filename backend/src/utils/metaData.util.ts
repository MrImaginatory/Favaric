import config from "../configs/constant.config.js";

const sanitizeString = (str: string): string => {
    if (!str) return "";
    let text = str.replace(/<[^>]*>?/gm, ' '); // Strip HTML tags
    text = text.replace(/&nbsp;/g, ' ')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'"); // Decode basic entities
    text = text.replace(/[\r\n\t]+/g, ' '); // Replace newlines and tabs with space
    text = text.replace(/\s+/g, ' ').trim(); // Remove multiple spaces
    return text;
};

const generateMetaTitle = (title: string): string => {
    const cleanTitle = sanitizeString(title);
    return `${cleanTitle} | ${config.WEBSITE_NAME}`;
}

const generateMetaDescription = (description: string): string => {
    const cleanDesc = sanitizeString(description);
    return `${cleanDesc} | ${config.WEBSITE_NAME}`;
}

const generateMetaKeywords = (keywords: string | string[]): string => {
    const keywordsArray = Array.isArray(keywords) ? keywords : [keywords];
    const cleanKeywords = keywordsArray.map(k => sanitizeString(k));
    return `${cleanKeywords.join(", ")} | ${config.WEBSITE_NAME}`;
}

export { generateMetaTitle, generateMetaDescription, generateMetaKeywords };