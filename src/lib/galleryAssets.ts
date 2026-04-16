const GALLERY_PREFIX = "/gallery/";
const OPTIMIZED_GALLERY_PREFIX = "/gallery/optimized/";

export const galleryImageBlurDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%230b170f'/%3E%3Cstop offset='1' stop-color='%23293c24'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='16' height='9' fill='url(%23g)'/%3E%3C/svg%3E";

export function getOptimizedGallerySrc(src: string) {
  if (!src.startsWith(GALLERY_PREFIX) || src.startsWith(OPTIMIZED_GALLERY_PREFIX)) {
    return src;
  }

  return src.replace(GALLERY_PREFIX, OPTIMIZED_GALLERY_PREFIX).replace(/\.(jpe?g|png)$/i, ".webp");
}
