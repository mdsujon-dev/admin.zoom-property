import { RouteItem } from "../types/sidebarType";

export * from "./actionPermissions";

export type Persona = "employee";

export const personaHome = (_persona: Persona): string => "/";

export const mergeSidebarForPersona = (
  items: RouteItem[],
  _persona: Persona
): RouteItem[] => {
  return items;
};

export const isRouteAllowedForPersona = (
  _persona: Persona,
  _pathname: string
): boolean => {
  return true;
};
