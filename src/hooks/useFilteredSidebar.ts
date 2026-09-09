import { useMemo } from "react";
import { RouteItem, SubmenuItem } from "../types/sidebarType";
import { hasModuleAccess, isSuperAdmin } from "../utils/permission";
import { useMe } from "./useMe";

export const useFilteredSidebar = (items: RouteItem[]): RouteItem[] => {
  const { me } = useMe();

  return useMemo(() => {
    if (isSuperAdmin(me?.role)) return items;

    const canSee = (m?: string) => !m || hasModuleAccess(me, m);

    const result: RouteItem[] = [];
    for (const route of items) {
      if (route.submenus && route.submenus.length > 0) {
        const visibleSubs: SubmenuItem[] = route.submenus.filter((s) =>
          canSee(s.module)
        );
        if (visibleSubs.length > 0) {
          result.push({ ...route, submenus: visibleSubs });
        }
      } else if (canSee(route.module)) {
        result.push(route);
      }
    }
    return result;
  }, [items, me]);
};

export default useFilteredSidebar;
