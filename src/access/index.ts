import { RouteItem } from "../types/sidebarType";

export * from "./actionPermissions";

export type Persona = "employee";

export const personaHome = (_persona: Persona): string => {
  void _persona;
  return "/";
};

export const mergeSidebarForPersona = (
  items: RouteItem[],
  _persona: Persona
): RouteItem[] => {
  void _persona;
  return items;
};

export const isRouteAllowedForPersona = (
  _persona: Persona,
  _pathname: string
): boolean => {
  void _persona;
  void _pathname;
  return true;
};
