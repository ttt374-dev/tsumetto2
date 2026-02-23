import type { Result } from "@/shared/result";
import type { Square } from "../entity";
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

export function withContext(
  error: ParseError,
  line: number,
  text: string
): ParseErrorWithContext {
  return { error, line, text }
}
