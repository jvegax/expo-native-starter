export type Id = string;

/** ISO 8601 date-time string as delivered by the API. Parse with `new Date()` at the edge. */
export type ISODateString = string;

export type Nullable<T> = T | null;

export type Maybe<T> = T | null | undefined;

export type ValueOf<T> = T[keyof T];

/** Flattens intersections so hover types read as a single object. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
