
export type Resource =
  | "candidate"
  | "offer"
  | "project"
  | "user" // The user management resource
  | "settings";

export type FieldAccessLevel =
  | "hidden"
  | "read"
  | "write";

// This interface can be used for more complex field permission definitions if needed later.
export interface FieldPermission {
  resource: Resource;
  field: string;
  access: FieldAccessLevel;
}
