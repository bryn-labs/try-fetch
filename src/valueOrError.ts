export type ValueOrError<V, E> = {value: V; error: null} | {error: E; value: null};

export const asValue = <V>(value: V): ValueOrError<V, never> => ({value: value, error: null});

export const asError = <E>(error: E): ValueOrError<never, E> => ({error: error, value: null});