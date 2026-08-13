/** Type that can be T or null */
type Nullable<T> = T | null

/** Type that can be T or undefined */
type Unsure<T> = T | undefined

/** Type that can be T or undefined or null */
type Nullish<T> = T | undefined | null

/** Promise that may be undefined */
type UsurePromise<T> = Unsure<Promise<T>>

export type {
    Nullable,
    Nullish,
    Unsure,
    UsurePromise
}