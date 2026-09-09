import { Tooltip } from "antd";
import { Dot } from "lucide-react";
import { FC } from "react";
import { NavLink } from "react-router-dom";

interface SubMenuItemProps {
  label: string;
  address: string;
  /** Falls back to a dot when the item has none. */
  icon?: FC<{ size?: number; className?: string }> | React.ElementType;
  /** How many items are waiting behind this link. Nothing is drawn at zero. */
  badge?: number;
  onClick?: () => void;
  /**
   * Whether this is the entry the current page belongs to.
   *
   * Passed in rather than left to NavLink, which can only ask "does my address
   * prefix this path" and so lights "/employees" and "/employees/roles"
   * together. The group works out which one wins; this just draws it.
   */
  active?: boolean;
}

export const SubMenuItem: FC<SubMenuItemProps> = ({
  label,
  address,
  icon: Icon,
  active,
  badge = 0,
  onClick,
}) => {
  return (
    <NavLink
      to={address}
      onClick={onClick}
      className={({ isActive: navActive }) =>
        `flex items-center gap-2 font-display py-2 px-3 rounded-[7px] transition-all duration-300 group min-w-0 ${
          (active ?? navActive)
            ? "bg-primary-50 text-primary font-semibold"
            : "text-secondary-500 hover:text-primary hover:bg-primary-50/50"
        }`
      }
    >
      {({ isActive: navActive }) => {
        const on = active ?? navActive;
        return (
        <>
          {Icon ? (
            <Icon
              size={16}
              className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                on ? "text-primary" : ""
              }`}
            />
          ) : (
            <Dot
              size={20}
              className={`shrink-0 transition-all duration-300 group-hover:scale-125 ${
                on ? "text-primary fill-primary" : ""
              }`}
            />
          )}
          <Tooltip title={label} placement="right">
            <span className="text-sm truncate whitespace-nowrap flex-1 min-w-0">
              {label}
            </span>
          </Tooltip>
          {/* Same pill as the top level, a step smaller to sit under it: this
              is the count of what is waiting, and amber because it is work to
              get to rather than something gone wrong. */}
          {badge > 0 && (
            <span
              className="ml-auto shrink-0 rounded-full bg-amber-100 px-1.5 py-[1px] text-[10px] font-semibold leading-[1.4] text-amber-800 tabular-nums"
              aria-label={`${badge} waiting`}
            >
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </>
        );
      }}
    </NavLink>
  );
};
