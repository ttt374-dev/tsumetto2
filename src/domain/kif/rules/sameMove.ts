import type { Move } from "../entity"

export function isSameMove(a: Move, b: Move): boolean {
    //console.log("samemove" ,a, b )
    return a.from?.file === b.from?.file &&
        a.from?.rank === b.from?.rank &&
        a.to.file === b.to.file &&
        a.to.rank === b.to.rank &&
        a.pieceType === b.pieceType

}