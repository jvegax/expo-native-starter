import { Image as ExpoImage, type ImagePrefetchOptions, type ImageProps as ExpoImageProps } from 'expo-image';
import type { Ref } from 'react';

export type ImageProps = ExpoImageProps & {
  ref?: Ref<ExpoImage>;
};

/**
 * The image component of the app (expo-image): memory + disk cache and a short cross-fade by default.
 * Inside a recycled <List> row pass `recyclingKey={item.id}` so a reused row never shows the previous
 * item's image; pass `placeholder` (blurhash, thumbhash or a local asset) to avoid an empty box.
 */
export function Image({ cachePolicy = 'memory-disk', transition = 150, ...props }: ImageProps) {
  return <ExpoImage cachePolicy={cachePolicy} transition={transition} {...props} />;
}

/** Warms the cache for images the user is about to see (next screen, next page). */
export function prefetchImages(urls: string | string[], options?: ImagePrefetchOptions): Promise<boolean> {
  return ExpoImage.prefetch(urls, options);
}
