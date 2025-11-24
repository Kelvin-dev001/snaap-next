/**
 * Adds Cloudinary transformation parameters to a full Cloudinary URL.
 * @param url - The original Cloudinary image URL.
 * @param opts - Options like width, quality, format (all optional).
 * @returns Optimized URL string, or a fallback image if url is falsy.
 */

export type CloudinaryOpts = {
  width?: number;
  quality?: number | string;
  format?: string;
};

export function getOptimizedCloudinaryUrl(
  url?: string | null,
  { width = 400, quality = "auto", format = "auto" }: CloudinaryOpts = {}
): string {
  if (!url || typeof url !== "string" || url.trim() === "") return "/fallback.png";
  // Only optimize Cloudinary URLs
  if (!url.includes("/image/upload/")) return url;

  const parts = url.split("/image/upload/");
  if (parts.length !== 2) return url;

  const transform = `f_${format},q_${quality},w_${width}/`;
  return `${parts[0]}/image/upload/${transform}${parts[1]}`; 
}

export default getOptimizedCloudinaryUrl;