/**
 * Pulls the address out of an embed snippet.
 *
 * Tour and video providers hand out an `<iframe …>` block rather than a bare
 * link, so that is what ends up pasted into the form. Take the `src` when we
 * are clearly looking at markup instead of sending the whole thing on.
 */
const srcFromEmbed = (val: string) => {
  if (!val.includes("<")) return val;
  const match = val.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
  return match ? match[1].trim() : val;
};

/**
 * Tidies a URL typed into a form: blank becomes `undefined`, a bare
 * `example.com` gains an `https://`, and an embed snippet is reduced to its
 * `src`. Mirrors the server's own rules, so what passes here passes there.
 */
export const normalizeUrl = (url?: string) => {
  if (!url) return undefined;
  const candidate = srcFromEmbed(url.trim()).trim();
  // A scheme on its own is the same as leaving the field empty.
  if (!candidate || /^https?:\/\/$/i.test(candidate)) return undefined;
  return /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
};

const isHostLike = (url: URL) =>
  url.hostname === "localhost" ||
  /^[^.]+(\.[^.]+)+$/.test(url.hostname.replace(/\.$/, ""));

/**
 * An Ant Design rule for an optional URL field, matching the server's own
 * check so the form catches a typo here rather than after a round trip.
 */
export const urlRule = {
  validator: (_rule: unknown, value?: string) => {
    const normalized = normalizeUrl(value);
    if (!normalized) return Promise.resolve();
    try {
      if (isHostLike(new URL(normalized))) return Promise.resolve();
    } catch {
      // fall through to the rejection below
    }
    return Promise.reject(
      new Error("Enter a valid URL, for example https://example.com/tour")
    );
  },
};

export default normalizeUrl;
