/**
 * A live count an item can carry, named rather than passed as a number.
 *
 * `SidebarItems.ts` is a static list — it cannot hold a figure that changes
 * while somebody is looking at it. So an item names the count it wants and the
 * menu resolves it (see `hooks/useSidebarBadges.ts`), which keeps the fetching
 * in one place and stops the config quietly becoming a data layer.
 */
export type BadgeSource = "pendingRefunds";

export interface SubmenuItem {
  label: string;
  address: string;
  /** Live count to show on the right. Hidden at zero. */
  badge?: BadgeSource;
  /**
   * The item's own icon. Optional: without one the item falls back to a dot,
   * which is what every submenu used to show — and which made two entries in
   * the same group impossible to tell apart at a glance.
   */
  icon?: React.ElementType;
  /** Permission module name. Item is hidden unless user has any access. */
  module?: string;
}

export interface RouteItem {
  icon: React.ElementType;
  label: string;
  address?: string;
  /** Permission module name. Item is hidden unless user has any access. */
  module?: string;
  /** Sidebar section this item belongs to (renders as a group header). */
  section?: string;
  /** Live count to show on the right. Hidden at zero. */
  badge?: BadgeSource;
  submenus?: SubmenuItem[];
}
