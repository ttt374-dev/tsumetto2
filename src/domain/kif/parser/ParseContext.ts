import type { Result } from "@/application/result";
import type { Square } from "../types";
import type { ParseError, ParseErrorWithContext } from "./ParseError";

export type ParseWarning =
  | { code: "ignored-line"; line: number; text: string }
  | { code: "unknown-header"; key: string }


export type ParseContext = {
  readonly source: string;     // 元KIF全文
  readonly lines: string[];

  lineIndex: number;           // 0-based
  currentLine?: string;

  prevSquare?: Square;

  warnings: ParseWarning[];
}

function withLine<T>(
  ctx: ParseContext,
  fn: () => Result<T, ParseError>
): Result<T, ParseErrorWithContext> {
  const res = fn()
  if (!res.ok) {
    return {
      ok: false,
      error: {
        ...res.error,
        line: ctx.lineIndex + 1,
        text: ctx.currentLine
      }
    }
  }
  return res
}
