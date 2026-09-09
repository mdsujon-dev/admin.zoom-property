import { PermissionRequirement } from "../utils/permission";

export type ActionKey =
  | "properties.view"
  | "properties.create"
  | "properties.update"
  | "properties.delete"
  | "properties.publish"
  | "properties.feature"
  | "projects.view"
  | "projects.create"
  | "projects.update"
  | "projects.delete"
  | "areas.view"
  | "areas.create"
  | "areas.update"
  | "areas.delete"
  | "blog.view"
  | "blog.create"
  | "blog.update"
  | "blog.delete"
  | "reviews.view"
  | "reviews.create"
  | "reviews.update"
  | "reviews.publish"
  | "reviews.delete"
  | "enquiries.view"
  | "enquiries.update"
  | "enquiries.delete"
  | "employees.view"
  | "employees.create"
  | "employees.update"
  | "employees.delete"
  | "employees.changePassword"
  | "roles.view"
  | "roles.create"
  | "roles.update"
  | "roles.delete"
  | "roles.permission"
  | "designations.view"
  | "designations.create"
  | "designations.update"
  | "designations.delete"
  | "media.view"
  | "media.upload"
  | "media.delete";

export const ACTION_PERMISSIONS: Record<ActionKey, PermissionRequirement> = {
  "properties.view": { module: "Properties", action: "View" },
  "properties.create": { module: "Properties", action: "Create" },
  "properties.update": { module: "Properties", action: "Update" },
  "properties.delete": { module: "Properties", action: "Delete" },
  "properties.publish": { module: "Properties", action: "Update" },
  "properties.feature": { module: "Properties", action: "Update" },

  "projects.view": { module: "Projects", action: "View" },
  "projects.create": { module: "Projects", action: "Create" },
  "projects.update": { module: "Projects", action: "Update" },
  "projects.delete": { module: "Projects", action: "Delete" },

  "areas.view": { module: "Areas", action: "View" },
  "areas.create": { module: "Areas", action: "Create" },
  "areas.update": { module: "Areas", action: "Update" },
  "areas.delete": { module: "Areas", action: "Delete" },

  "blog.view": { module: "Blog", action: "View" },
  "blog.create": { module: "Blog", action: "Create" },
  "blog.update": { module: "Blog", action: "Update" },
  "blog.delete": { module: "Blog", action: "Delete" },

  "reviews.view": { module: "Reviews", action: "View" },
  "reviews.create": { module: "Reviews", action: "Create" },
  "reviews.update": { module: "Reviews", action: "Update" },
  "reviews.publish": { module: "Reviews", action: "Update" },
  "reviews.delete": { module: "Reviews", action: "Delete" },

  "enquiries.view": { module: "Contact Messages", action: "View" },
  "enquiries.update": { module: "Contact Messages", action: "Update" },
  "enquiries.delete": { module: "Contact Messages", action: "Delete" },

  "employees.view": { module: "Employees", action: "View" },
  "employees.create": { module: "Employees", action: "Create" },
  "employees.update": { module: "Employees", action: "Update" },
  "employees.delete": { module: "Employees", action: "Delete" },
  "employees.changePassword": { module: "Employees", action: "Change Password" },

  "roles.view": { module: "Roles", action: "View" },
  "roles.create": { module: "Roles", action: "Create" },
  "roles.update": { module: "Roles", action: "Update" },
  "roles.delete": { module: "Roles", action: "Delete" },
  "roles.permission": { module: "Roles", action: "Update" },

  "designations.view": { module: "Designations", action: "View" },
  "designations.create": { module: "Designations", action: "Create" },
  "designations.update": { module: "Designations", action: "Update" },
  "designations.delete": { module: "Designations", action: "Delete" },

  "media.view": { module: "Media Library", action: "View" },
  "media.upload": { module: "Media Library", action: "Create" },
  "media.delete": { module: "Media Library", action: "Delete" },
};

export const requirementFor = (
  action: ActionKey
): PermissionRequirement | undefined => ACTION_PERMISSIONS[action];
