import slug from 'slug';

const slugGenerator = (text: string): string => {
    return slug(text, '_');
}

export default slugGenerator;
