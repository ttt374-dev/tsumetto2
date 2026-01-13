export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ParseError };

  
type ParseError = {
  message: string;
  //position?: number;
  //rawText: string;
};
