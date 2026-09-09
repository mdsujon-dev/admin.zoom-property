import { useMemo } from "react";
import {
  IServicesCountry,
  useGetServicesCountriesQuery,
} from "../../../../redux/features/settings/servicesCountryApi";
import { PermissionModule, PERMISSION_MODULES } from "./permissionModules";

const CRUD = ["View", "Create", "Update", "Delete"];

interface PermissionCatalog {
  modules: PermissionModule[];
  totalCount: number;
  distinctActions: string[];
}

/**
 * Builds the permission catalog where the "Services" module's `permissions`
 * array is extended at runtime with the active services-countries names.
 * Final shape:
 *   { module: "Services",
 *     permissions: ["View", "Create", "Update", "Delete",
 *                   "<Country1>", "<Country2>", ...] }
 *
 * Same names are used for tab visibility on the Services list page and
 * backend gating, so a role granted "Services-Bangladesh" can see/use the
 * Bangladesh tab and pass backend checks for that country.
 */
export function usePermissionModules(): PermissionCatalog {
  const { data } = useGetServicesCountriesQuery({ isActive: "true" });
  // Memoize so the array reference is stable across renders when the
  // underlying data hasn't changed; otherwise the consuming useMemo below
  // would re-compute on every render.
  const countries = useMemo<IServicesCountry[]>(
    () => data?.data ?? [],
    [data]
  );

  return useMemo(() => {
    const countryActions = countries
      .map((c) => c.name?.trim())
      .filter((n): n is string => !!n);

    // "All" is an explicit gate for the "All" tab on the Services list page.
    // Without it, only specific country tabs the role has are shown.
    const modules: PermissionModule[] = PERMISSION_MODULES.map((m) =>
      m.module === "Services"
        ? { ...m, permissions: [...CRUD, "All", ...countryActions] }
        : m
    );
    // Earlier version (no "All" gate) — kept for reference.
    // const modules: PermissionModule[] = PERMISSION_MODULES.map((m) =>
    //   m.module === "Services"
    //     ? { ...m, permissions: [...CRUD, ...countryActions] }
    //     : m
    // );

    const totalCount = modules.reduce(
      (sum, m) => sum + m.permissions.length,
      0
    );
    const distinctActions = Array.from(
      new Set(modules.flatMap((m) => m.permissions))
    );

    return { modules, totalCount, distinctActions };
  }, [countries]);
}
