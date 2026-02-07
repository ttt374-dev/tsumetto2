export type ParseError = ParseMoveError  | ParseInitialBoardError

export type ParseMoveError = 
    | { code: "unknown-piece-kanji", cause?: any}
    | { code: "invalid-move-body", cause?: any}
    | { code: "invalid-square", cause?: any}
    | { code: "no-previous-square-given", cause?: any}
    | { code: "unknown-piece-type", cause?: any}
    | { code: "invalid-number-kanji", cause?: any}    
    | { code: "missing-move-section", cause?: string }
    

export type ParseInitialBoardError =
  | { code: "no-board-section" }
  | { code: "invalid-board-format";}
  | { code: "unknown-piece-kanji"; kanji: string }
  | { code: "unknown-piece", cause?: string}
  | { code: "board-not-closed" }
  | { code: "invalid-board-line-count"; actual: number }
  | { code: "invalid-board-row"; row: number }


export type ParseErrorWithContext = ParseError & {
  line: number
  text?: string
}