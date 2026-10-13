import { parsePackageJsonEnvironments } from '../apps/utils.environment'

// Lazily resolved and cached so package.json is read at most once per process
let cachedDefaultServiceName: string | undefined

/**
 * Strip the npm scope from a package name.
 *
 * @param packageName - Raw package name, e.g. `@gisatcz/panther-api`.
 * @returns Unscoped name, e.g. `panther-api`.
 */
const stripPackageScope = (packageName: string): string => packageName.replace(/^@[^/]+\//, '')

/**
 * Resolve the service name from the package.json of the running application.
 *
 * Uses `process.cwd()` as the application root, so consuming services get their
 * own package name rather than this library's. The result is cached after the
 * first successful read.
 *
 * @returns The unscoped package name, or undefined when it cannot be resolved.
 */
const defaultServiceName = (): string | undefined => {
  if (cachedDefaultServiceName) return cachedDefaultServiceName

  try {
    const { pkgName } = parsePackageJsonEnvironments(process.cwd())

    if (!pkgName) return undefined

    cachedDefaultServiceName = stripPackageScope(pkgName)

    return cachedDefaultServiceName
  } catch {
    // Missing or unreadable package.json - let the caller report the error
    return undefined
  }
}

/**
 * Options for composing a Redis key that is unique across backend services.
 */
export interface RedisUniqueKeyProps {

  /** Explicit namespace; wins over package.json resolution. */
  serviceName?: string;

  /** Ordered custom values appended after the service name. */
  values: (string | number)[];

  /** When true (default) and no serviceName is given, resolve it from package.json. */
  fromPackageJson?: boolean;
}

/**
 * Compose a namespaced Redis key as `serviceName:value1:value2:...`.
 *
 * The service name namespaces the key so multiple services can share a single
 * Redis DB without collisions. When omitted, the name is read from the running
 * application's package.json (npm scope stripped). The result is deterministic:
 * equal inputs always produce the same key.
 *
 * @param props.serviceName - Optional namespace for the owning service.
 * @param props.values - Custom values appended in order; must contain at least one item.
 * @param props.fromPackageJson - Resolve the service name from package.json (default true).
 * @returns Colon-joined Redis key.
 * @throws {Error} If the service name cannot be resolved or `values` is empty.
 */
export const redisUniqueKey = ({ serviceName, values, fromPackageJson = true }: RedisUniqueKeyProps): string => {
  let resolvedServiceName = serviceName

  if (resolvedServiceName === undefined) {
    if (fromPackageJson === false)
      throw new Error("redisUniqueKey: serviceName is required when fromPackageJson is false")

    resolvedServiceName = defaultServiceName()

    if (!resolvedServiceName)
      throw new Error("redisUniqueKey: could not resolve service name from package.json, pass serviceName explicitly")
  }

  if (!resolvedServiceName) throw new Error("redisUniqueKey: serviceName must not be empty")

  if (!values || values.length === 0) throw new Error("redisUniqueKey: values must contain at least one item")

  return [resolvedServiceName, ...values].join(':')
}
