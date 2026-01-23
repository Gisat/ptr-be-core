/**
 * The default name for the SQLite database file in backend and SSR apps.
 * Default value is "db.sqlite".
 */
export const DEFAULT_DB_NAME = "db.sqlite";

/**
 * The default expiration time for database states, in seconds. For backend and SSR apps.
 * Default value is set to 1 day (86400 seconds).
 */
export const DEFAULT_DB_STATE_EXPIRATION_SEC = 60 * 60 * 24; // default to 1 day
