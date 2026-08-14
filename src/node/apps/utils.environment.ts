import { join } from 'path'
import { readFileSync } from 'fs'
import { loggyWarn } from '../logging/logger';

/**
 * Parse package.json metadata from a given working directory.
 *
 * Reads package.json, extracts name, description, and version.
 * Logs a warning if any of these fields are missing.
 *
 * @param cwdPath - Absolute or relative path to the application's working directory.
 * @returns Object with pkgName, pkgDescription, and pkgVersion (all string | undefined).
 * @throws {Error} If the file cannot be read or parsed (propagates from fs/JSON).
 */
export const parsePackageJsonEnvironments = (cwdPath: string) => {

    // Build the path to package.json and read it
    const packageJsonPath = join(cwdPath, "package.json");

    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    // Extract required fields
    const { name: pkgName, description: pkgDescription, version: pkgVersion } = packageJson

    // Warn if any essential fields are missing
    if (!pkgName || !pkgDescription || !pkgVersion)
        loggyWarn("Environment parse:", `Package.json is missing some of the required fields: name, description, version`)

    return { pkgName, pkgDescription, pkgVersion }
}