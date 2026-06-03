import config from "../configs/constant.config.js";

const generateMetaTitle = (title: string): string => {
    return `${title} | ${config.WEBSITE_NAME}`;
}

const generateMetaDescription = (description: string): string => {
    return `${description} | ${config.WEBSITE_NAME}`;
}

const generateMetaKeywords = (keywords: string[]): string => {
    return `${keywords.join(", ")} | ${config.WEBSITE_NAME}`;
}

export { generateMetaTitle, generateMetaDescription, generateMetaKeywords };