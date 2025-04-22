import DefaultImage from '../assets/default-image.png';

export const getPreferredImage = (images?: { image?: string; profile: string }[]) => {
    if (!images || !Array.isArray(images)) return DefaultImage;

    // Check for asset-mezzanine-16x9 profile first (PBS assets typically use this)
    const asset = images.find(img => img.profile === "asset-mezzanine-16x9");
    if (asset?.image) return asset.image;

    // Fall back to episode profile
    const episode = images.find(img => img.profile === "episode-mezzanine-16x9");
    if (episode?.image) return episode.image;

    // Look for any mezzanine profile
    const fallback = images.find(img => img.profile?.toLowerCase().includes("mezzanine"));
    if (fallback?.image) return fallback.image;

    // Take any image
    const anyImage = images.find(img => img.image);
    if (anyImage?.image) return anyImage.image;

    return DefaultImage;
};