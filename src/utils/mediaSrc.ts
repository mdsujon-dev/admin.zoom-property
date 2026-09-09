import { config } from "../config";

type MediaLike = { url?: string; key?: string } | null | undefined;

/**
 * Where a populated media document's file actually lives.
 *
 * The API hands back an absolute `url`, built on the storage bucket's public
 * base. `key` is only the object's path inside that bucket: on its own it
 * means nothing to a browser, and pointing it at the app's own origin asks for
 * a file that was never served from there. So take the url, and keep the key
 * join as a fallback for anything stored before the virtual existed.
 */
export const mediaSrc = (media: MediaLike) => {
  if (!media) return "";
  if (media.url) return media.url;
  const key = media.key;
  if (!key) return "";
  if (/^(https?:)?\/\//i.test(key)) return key;
  const base = String(config.image_access_url ?? "").replace(/\/+$/, "");
  return `${base}/${key.replace(/^\/+/, "")}`;
};

export default mediaSrc;
