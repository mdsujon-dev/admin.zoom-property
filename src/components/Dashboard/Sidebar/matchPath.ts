/**
 * Which sidebar entry the page you are on belongs to.
 *
 * The sidebar used to compare `location.pathname` to an entry's address with
 * `===`, which is true only on the list page itself. Open a client to edit
 * them and the group collapsed, the entry lost its highlight, and the sidebar
 * stopped saying where you were — at exactly the moment you were deepest into
 * a section and most likely to want telling.
 *
 * `end`/`exactMatch` was the workaround for the other half of the problem:
 * "/employees" is a prefix of "/employees/roles", so a plain prefix test lights
 * both at once. Answering "which entry" rather than "does this one match"
 * settles both — the longest matching address wins, so a child route lights its
 * own entry and nothing above it.
 */

/** True for the address itself and anything under it — never for a sibling
    that merely starts with the same letters ("/clients-archive"). */
export const isUnder = (pathname: string, address?: string) =>
  !!address && (pathname === address || pathname.startsWith(`${address}/`));

/**
 * The most specific of several addresses that covers this path.
 *
 * Returns undefined when none of them do. "/" is excluded from prefix matching
 * by `isUnder` only for exact equality, since every path starts with it.
 */
export const bestMatch = (
  pathname: string,
  addresses: (string | undefined)[],
): string | undefined =>
  addresses
    .filter((a): a is string => isUnder(pathname, a))
    .sort((a, b) => b.length - a.length)[0];
