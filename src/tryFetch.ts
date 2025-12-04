import {asError, asValue, ValueOrError} from "./valueOrError";

export type FetchError<T> =
  | {
  connectionError: true;
  jsonParsingError?: never;
  status?: never;
  statusText?: never;
  error?: never;
}
  | {
  connectionError?: never;
  status: number;
  statusText: string;
  jsonParsingError: true;
  error?: never;
}
  | {
  connectionError?: never;
  jsonParsingError?: never;
  status: number;
  statusText: string;
  error: T;
};

export const tryFetch = async <T, E>(
  input: string,
  init: RequestInit = {},
): Promise<ValueOrError<T, FetchError<E>>> => {

  try {
    const response = await fetch(input, init);

    let data: unknown;
    try {
      const body = (await response.text()) || "{}";
      data = JSON.parse(body);
    } catch {
      return asError({
        jsonParsingError: true,
        status: response.status,
        statusText: response.statusText,
      });
    }

    if (response.ok) {
      return asValue(data as T);
    } else {
      return asError({
        status: response.status,
        statusText: response.statusText,
        error: data as E,
      });
    }
  } catch (err) {
    console.log(err);
    return asError({
      connectionError: true,
    });
  }
};