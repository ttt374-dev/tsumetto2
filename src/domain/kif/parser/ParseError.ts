export type ParseError = 
    | { code: "unknown-piece-kanji", cause?: any}
    | { code: "invalid-move-body", cause?: any}
    | { code: "invalid-square", cause?: any}
    | { code: "no-previous-square-given", cause?: any}
    | { code: "unknown-piece-type", cause?: any}

export type ParseMoveLinesError = 
    {
        moveError: ParseError
        line: number
        text: string
    }