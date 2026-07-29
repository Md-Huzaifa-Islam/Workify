import { revalidateTag, unstable_cache } from "next/cache";

/**
 * Wraps a server-side data function with Next.js's request-independent data
 * cache. `tags` should be revalidated (via revalidateTag) by any write
 * endpoint that changes the underlying data, so reads stay consistent
 * immediately after a mutation instead of waiting out `revalidateSeconds`.
 */
export function cached<Args extends unknown[], T>(
  key: string,
  revalidateSeconds: number,
  tags: string[],
  fn: (...args: Args) => Promise<T>,
): (...args: Args) => Promise<T> {
  return unstable_cache(fn, [key], { revalidate: revalidateSeconds, tags });
}

export function entityTag(entity: string) {
  return `entity:${entity}`;
}

/** Expires a tag's cache entries immediately, for use right after a write. */
export function revalidate(tag: string) {
  revalidateTag(tag, { expire: 0 });
}
