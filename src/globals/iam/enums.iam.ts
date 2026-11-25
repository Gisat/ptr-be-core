/**
 * Authentication roles used throughout the application.
 *
 * Stored as VARCHAR(64)[] in the database.
 */
export enum UsedAuthRoles {

  // Index 0
  PublicUser = "public_user",

  // Index 1
  RegisteredUser = "registered_user",

  // Index 2
  Admin = "admin",

  // Index 3
  Superadmin = "superadmin",
}

/**
 * Authentication groups used throughout the application.
 *
 * Groups are assigned locally by identity services. Values are added here
 * once the identity domain defines them.
 */
export enum UsedAuthGroups {}
