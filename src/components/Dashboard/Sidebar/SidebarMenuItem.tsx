import { Tooltip } from "antd";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

import { isUnder } from "./matchPath";
import { toggleSidebar } from "../../../redux/features/sidebar/sidebarSlice";
import { MenuTooltip } from "./MenuTooltip";

interface SidebarMenuItemProps {
  label: string;
  address: string;
  icon?: React.ElementType;
  /** How many items are waiting behind this link. Nothing is drawn at zero. */
  badge?: number;
  /**
   * Whether this is the entry the current page belongs to.
   *
   * Passed in rather than worked out here, because an entry cannot tell on its
   * own: a longer address inside some other group may cover this path, and only
   * the menu sees every address at once.
   */
  active?: boolean;
  onClick?: () => void;
}

export const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  label,
  address,
  icon: Icon,
  badge = 0,
  active,
  onClick,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  /*
   * The dashboard is the one entry that has to match exactly: every path in the
   * app begins with "/", so a prefix test would light it on every screen. Every
   * other entry owns the pages beneath it.
   */
  const exact = address === "/";
  const isActive =
    active ??
    (exact ? location.pathname === address : isUnder(location.pathname, address));
  const isCollapsed = useSelector((state: any) => state.sidebar.isCollapsed);

  const handleClick = () => {
    dispatch(toggleSidebar());
    if (onClick) onClick();
  };

  const menuItem = (
    <NavLink
      to={address}
      end={exact}
      onClick={handleClick}
      className={() =>
        `flex items-center gap-3 font-display rounded-[7px] transition-all duration-300 transform relative min-w-0 ${
          isCollapsed ? "justify-center px-3 py-2" : "px-4 py-2"
        } ${
          isActive
            // A solid brand bar, not a tint. `primary-100` is a 3%-saturation
            // wash: it is the brand hue, but at this size it is indistinguishable
            // from grey, so the panel looked unbranded even after the palette
            // changed. White on `primary` measures 4.75:1 and passes AA, so the
            // active item can carry the colour outright.
            ? "bg-primary text-white font-semibold shadow-sm"
            : "text-secondary-600 hover:bg-primary-50 hover:text-primary hover:shadow-sm"
        }`
      }
    >
      {Icon && (
        <Icon
          size={18}
          className="shrink-0 transition-transform duration-300 group-hover:scale-110"
        />
      )}
      {!isCollapsed && (
        <Tooltip title={label} placement="right">
          <span className="font-semibold truncate whitespace-nowrap flex-1 min-w-0">
            {label}
          </span>
        </Tooltip>
      )}
      {/*
        The count of what is waiting, in the slot the active dot uses — the two
        never appear together, because a dot saying "you are here" beside a
        number saying "three of these need you" is two marks competing for the
        same corner, and the number is the one carrying information.

        Amber rather than red: these are things to get to, not things that have
        gone wrong. Red is for the register that failed to balance.
      */}
      {badge > 0 && !isCollapsed && (
        <span
          className="ml-auto shrink-0 rounded-full bg-amber-100 px-1.5 py-[1px] text-[11px] font-semibold leading-[1.4] text-amber-800 tabular-nums"
          aria-label={`${badge} waiting`}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}

      {/* Collapsed there is no room for the figure, so it becomes a dot on the
          icon — enough to send somebody looking, which is all it can do at
          this width. */}
      {badge > 0 && isCollapsed && (
        <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
      )}

      {isActive && !isCollapsed && badge === 0 && (
        <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></span>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    // The dot on the icon says there is something; the tooltip is the only
    // place left that can say how much.
    return (
      <MenuTooltip label={badge > 0 ? `${label} (${badge})` : label}>
        {menuItem}
      </MenuTooltip>
    );
  }

  return menuItem;
};
