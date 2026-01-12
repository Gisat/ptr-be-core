import { join } from 'path'
import { readFileSync } from 'fs'
import { loggyWarn } from '../logging/logger';

/**
 * Parse package.json metadata from a given working directory.
 *
 * Reads the file at path.join(cwdPath, "package.json"), parses it as JSON and returns the
 * package's name, description and version.
 *
 * @param cwdPath - Absolute or relative path to the application's working directory containing package.json.
 * @returns An object with the extracted properties:
 *  - pkgName: string | undefined — value of package.json's "name" field
 *  - pkgDescription: string | undefined — value of package.json's "description" field
 *  - pkgVersion: string | undefined — value of package.json's "version" field
 * @throws {Error} Propagates errors from fs.readFileSync or JSON.parse if the file cannot be read or contains invalid JSON.
 * @remarks
 * - If any of the required fields (name, description, version) are missing the function will still return,
 *   but will call loggyWarn to emit a warning.
 * - This function does not validate the semantics of the values (e.g. semver format for version).
 * @example
 * const { pkgName, pkgDescription, pkgVersion } = parsePackageJsonEnvironments("/path/to/app");
 */
export const parsePackageJsonEnvironments = (cwdPath: string) => {

    // Read package.json for application
    const packageJsonPath = join(cwdPath, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const { name: pkgName, description: pkgDescription, version: pkgVersion } = packageJson

    if (!pkgName || !pkgDescription || !pkgVersion)
        loggyWarn("Environment parse:", `Package.json is missing some of the required fields: name, description, version`)

    return { pkgName, pkgDescription, pkgVersion }
}