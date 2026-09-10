import { Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useFilteredSidebar } from "../../../hooks/useFilteredSidebar";
import { bestMatch } from "./matchPath";
import { SubmenuItem } from "../../../types/sidebarType";
import { MenuTooltip } from "./MenuTooltip";
import sidebarMenuRoutes from "./SidebarItems";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SubMenuItem } from "./SubMenuItem";

const AdminMenu = () => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const isCollapsed = useSelector((state: any) => state.sidebar.isCollapsed);
  const visibleRoutes = useFilteredSidebar(sidebarMenuRoutes);
  // Resolved here rather than in the item: one fetch for the menu, not one per
  // entry that happens to want a number.
  /* Nothing carries a live count at the moment. The prop stays on the item so
     re-introducing one is a hook and a lookup, not a change to every item. */
  const badges: Record<string, number> = {};

  /**
   * The one address in the whole menu that owns the page being looked at.
   *
   * Decided across every entry, not group by group. Entries that overlap used
   * to live together — "/employees" and "/employees/roles" were both under
   * Employee Management — so asking each group for its own best match happened
   * to give the right answer. Roles now sits in Settings while the "/employees"
   * it hangs under sits in HR, and the per-group question lit both entries and
   * opened both accordions: the sidebar claimed the reader was in two places.
   *
   * One question, one winner, and the longest address wins — so a child page
   * lights its own entry and nothing above it.
   */
  const activeAddress = useMemo(
    () =>
      bestMatch(
        location.pathname,
        visibleRoutes.flatMap((r) =>
          r.submenus ? r.submenus.map((s) => s.address) : [r.address],
        ),
      ),
    [location.pathname, visibleRoutes],
  );

  // Auto-expand the group that holds the winner (on load + on nav), so the
  // active page is always visible in the sidebar after a refresh — editing a
  // client is still Academics, and a sidebar that collapses the moment you go
  // one level in stops answering "where am I".
  useEffect(() => {
    const activeGroup = visibleRoutes.find((r) =>
      r.submenus?.some((s) => s.address === activeAddress),
    );
    if (activeGroup) setOpenSubmenu(activeGroup.label);
  }, [activeAddress, visibleRoutes]);

  const toggleSubmenu = (submenu: string) => {
    if (isCollapsed) return;
    setOpenSubmenu((prev) => (prev === submenu ? null : submenu));
  };

  const closeSubmenu = () => {
    setOpenSubmenu(null);
  };

  const isOpen = (submenu: string) => openSubmenu === submenu;

  /** True for the one group that holds the winning entry, and no other. */
  const isParentActive = (submenus: SubmenuItem[]) =>
    submenus.some((submenu) => submenu.address === activeAddress);

  /** The winning entry, when it happens to be in this group. */
  const activeIn = (submenus: SubmenuItem[]) =>
    submenus.some((s) => s.address === activeAddress)
      ? activeAddress
      : undefined;

  return (
    <div
      className={`py-6 space-y-2 transition-all duration-300 ${
        isCollapsed ? "px-2" : "px-4"
      }`}
    >
      {visibleRoutes.map((route, index) => {
        // Show a section header before the first item of each new section
        // (only when expanded). Skips empty sections automatically.
        const prevSection =
          index > 0 ? visibleRoutes[index - 1].section : undefined;
        const showSectionHeader =
          !isCollapsed && route.section && route.section !== prevSection;

        return (
          <div key={index}>
            {showSectionHeader && (
              <p className="px-4 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-secondary-400 first:pt-0">
                {route.section}
              </p>
            )}
            {!route.submenus ? (
              <SidebarMenuItem
                icon={route.icon}
                label={route.label}
                address={route.address ?? ""}
                // Decided by the menu, for the same reason the submenu entries
                // are: a top-level address can be covered by a longer one living
                // inside a group, and only the menu can see both.
                active={route.address === activeAddress}
                badge={route.badge ? badges[route.badge] : 0}
                onClick={closeSubmenu}
              />
            ) : (
              <MenuTooltip label={route.label} submenus={route.submenus}>
                <div>
                  <div
                    onClick={() => toggleSubmenu(route.label)}
                    className={`${
                      isParentActive(route.submenus) || isOpen(route.label)
                        ? "bg-primary-50 text-primary font-semibold"
                        : "text-secondary-600 hover:bg-primary-50 hover:text-primary hover:shadow-xs"
                    } flex items-center transition-all duration-200 transform rounded-[7px] font-display cursor-pointer group ${
                      isCollapsed
                        ? "justify-center px-3 py-2"
                        : "justify-between px-4 py-2"
                    }`}
                  >
                    <div
                      className={`flex items-center min-w-0 ${
                        isCollapsed ? "gap-0 justify-center" : "gap-3 flex-1"
                      }`}
                    >
                      <route.icon
                        size={18}
                        className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isParentActive(route.submenus) || isOpen(route.label)
                            ? "text-primary"
                            : ""
                        }`}
                      />
                      {!isCollapsed && (
                        <Tooltip title={route.label} placement="right">
                          <span className="font-semibold truncate whitespace-nowrap">
                            {route.label}
                          </span>
                        </Tooltip>
                      )}
                    </div>
                    {!isCollapsed && (
                      <IoIosArrowForward
                        className={`transform transition-all ease-in-out ${
                          isOpen(route.label)
                            ? "duration-200 rotate-90 text-primary"
                            : "rotate-0 duration-200 group-hover:text-primary"
                        }`}
                      />
                    )}
                  </div>
                  {!isCollapsed && (
                    <div
                      className={`grid ml-4 border-l-2 border-primary/20 transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isOpen(route.label)
                          ? "grid-rows-[1fr] opacity-100 mt-2"
                          : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                    >
                      <div
                        className={`overflow-hidden transition-[padding] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          isOpen(route.label) ? "pl-3" : "pl-3"
                        }`}
                      >
                        {route.submenus.map((subroute) => (
                          <SubMenuItem
                            key={subroute.label}
                            label={subroute.label}
                            address={subroute.address}
                            icon={subroute.icon}
                            // Decided by the group, not by the link: only the
                            // group can see that "/employees/roles" beats
                            // "/employees" for the page being looked at.
                            active={
                              activeIn(route.submenus!) === subroute.address
                            }
                            badge={subroute.badge ? badges[subroute.badge] : 0}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </MenuTooltip>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminMenu;
