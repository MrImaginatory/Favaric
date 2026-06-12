import config from "../configs/constant.config.js";

const generateMetaTitle = (title: string): string => {
    return `${title} | ${config.WEBSITE_NAME}`;
}

const generateMetaDescription = (description: string): string => {
    return `${description} | ${config.WEBSITE_NAME}`;
}

const generateMetaKeywords = (keywords: string | string[]): string => {
    const keywordsArray = Array.isArray(keywords) ? keywords : [keywords];
    return `${keywordsArray.join(", ")} | ${config.WEBSITE_NAME}`;
}

export { generateMetaTitle, generateMetaDescription, generateMetaKeywords };