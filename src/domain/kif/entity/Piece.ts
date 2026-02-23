import { Board } from "./Board"

export type Player = "black" | "white"
export type PieceType = "pawn" | "lance" | "knight" | "silver" | "gold" | "bishop" | "rook" | "king"

export type PieceItem = {
    type: PieceType, promoted: boolean
}
export const kanjiToPieceItem: Record<string, PieceItem> = {
    歩: { type: "pawn", promoted: false },
    と: { type: "pawn", promoted: true },       // 成り歩
    香: { type: "lance", promoted: false },
    杏: { type: "lance", promoted: true },      // 成り香
    成香: { type: "lance", promoted: true },
    桂: { type: "knight", promoted: false },
    圭: { type: "knight", promoted: true },     // 成り桂
    成桂: { type: "knight", promoted: true },     // 成り桂
    銀: { type: "silver", promoted: false },
    全: { type: "silver", promoted: true },     // 成り銀
    成銀: { type: "silver", promoted: true },     // 成り銀
    金: { type: "gold", promoted: false },
    角: { type: "bishop", promoted: false },
    馬: { type: "bishop", promoted: true },     // 成り角
    飛: { type: "rook", promoted: false },
    龍: { type: "rook", promoted: true },       // 成り飛
    竜: { type: "rook", promoted: true },       // 別表記の成り飛
    王: { type: "king", promoted: false },
    玉: { type: "king", promoted: false }
}
/*
export type Square = {
    file: number, rank: number,
}
    */
//export type SquareNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

function isSquareNumber(n: number): boolean {
    return n >= 1 && n <= 9
}

export class Square {
    constructor(
        readonly file: number,
        readonly rank: number,
    ) {}
        static create(file: number, rank: number): Square {
        if (!isSquareNumber(file) || !isSquareNumber(rank)) {
            throw new Error(`Invalid square: ${file}, ${rank}`)
        }
        return new Square(file, rank)
    }
/*
    get key(): string {
        //return `${this.file},${this.rank}`
        return Board.squareKey(this.file, this.rank)
    }
*/
}

export class Piece {
    constructor(
        readonly type: PieceType,
        readonly owner: Player,
        readonly promoted: boolean = false
    ) { }

    format(): string {
        const baseMapping = {
            pawn: "歩", lance: "香", knight: "桂", silver: "銀", gold: "金", bishop: "角", rook: "飛", king: "玉"
        }
        const promotedMapping = {
            pawn: "と", lance: "杏", knight: "圭", silver: "全", gold: "金", bishop: "馬", rook: "龍", king: "玉"
        }
        return this.promoted ? promotedMapping[this.type] : baseMapping[this.type]
    }

    demote(): Piece {
        return new Piece(this.type, this.owner, false)
    }

    promote(): Piece {
        return new Piece(this.type, this.owner, true)
    }
    ///////////////////////////////
    // seiralize
    toDTO(): PieceDTO {
        return {
            type: this.type,
            owner: this.owner,
            promoted: this.promoted,
        }

    }

    static fromDTO(dto: PieceDTO): Piece {
        return new Piece(dto.type, dto.owner, dto.promoted)
    }
}

export type PieceDTO = {
    type: PieceType
    owner: Player
    promoted: boolean
}
