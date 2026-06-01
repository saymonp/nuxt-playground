export const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;

    if (path.startsWith('http')) {
        return path;
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

    return `${baseUrl}${cleanPath}`;
};