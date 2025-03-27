type Nullable<T> = T | null
type Unsure<T> = T | undefined
type Nullish<T> = T | undefined | null
type UsurePromise<T> = Unsure<Promise<T>>

export {
    Nullable,
    Nullish,
    Unsure,
    UsurePromise
}