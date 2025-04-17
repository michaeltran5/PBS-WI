import DefaultImage from '../assets/default-image.png';

export const getPreferredImage = (images?: { image?: string; profile: string }[]) => {
    if (!images) return DefaultImage;

    const asset = images.find(img => img.profile === "asset-mezzanine-16x9");
    if (asset?.image) return asset.image;

    const episode = images.find(img => img.profile === "episode-mezzanine-16x9");
    if (episode?.image) return episode.image;

    const fallback = images.find(img => img.profile.toLowerCase().includes("mezzanine"));
    if (fallback?.image) return fallback.image;

    const anyImage = images.find(img => img.image);
    if (anyImage?.image) return anyImage.image;

    return DefaultImage;
};