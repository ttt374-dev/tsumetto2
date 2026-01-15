import { Piece, type PieceType, type Player, } from "./Piece"

export class Hand {
    private readonly counts: Record<PieceType, number>

    constructor(counts: Partial<Record<PieceType, number>> = {}) {
        this.counts = {
            pawn: 0,
            lance: 0,
            knight: 0,
            silver: 0,
            gold: 0,
            bishop: 0,
            rook: 0,
            king: 0,
            ...counts
        }
    }
    static empty(): Hand {
        return new Hand()
    }
    // 指定した駒の枚数を返す
    count(pieceType: PieceType): number {
        return this.counts[pieceType]
    }

    // 駒を追加して新しい Hand を返す（Immutable）
    add(pieceType: PieceType, n: number = 1): Hand {
        return new Hand({
            ...this.counts,
            [pieceType]: this.count(pieceType) + n
        })
    }

    // 駒を減らして新しい Hand を返す（Immutable）
    remove(pieceType: PieceType, n: number = 1): Hand {
        const current = this.count(pieceType)
        if (current < n) throw new Error(`Not enough pieces: ${pieceType}`)
        return new Hand({
            ...this.counts,
            [pieceType]: current - n
        })
    }

    toObject(): Record<PieceType, number> {
        return { ...this.counts }
    }

    // JSON 用にオブジェクト化
    toJSON(): Record<PieceType, number> {
        return this.toObject()
    }

    // JSON から復元
    static fromJSON(obj: Partial<Record<PieceType, number>>): Hand {
        return new Hand(obj)
    }
}


export type HandDTO = Partial<Record<PieceType, number>>

//////////////////////////////////////////
export class Hands {
    private readonly byPlayer: Record<Player, Hand>

    private constructor(byPlayer: Record<Player, Hand>) {
        this.byPlayer = byPlayer
    }

    static create(black: Hand, white: Hand): Hands {
        return new Hands({ black, white })
    }
    static empty(): Hands {
        return new Hands({
            black: Hand.empty(),
            white: Hand.empty(),
        })
    }

    get(player: Player): Hand {
        return this.byPlayer[player]
    }

    add(player: Player, pieceType: PieceType): Hands {
        return new Hands({
            ...this.byPlayer,
            [player]: this.byPlayer[player].add(pieceType),
        })
    }

    remove(player: Player, pieceType: PieceType): Hands {
        return new Hands({
            ...this.byPlayer,
            [player]: this.byPlayer[player].remove(pieceType),
        })
    }

    // serialize
    toJSON(): Record<Player, ReturnType<Hand["toJSON"]>> {
        return {
            black: this.byPlayer.black.toJSON(),
            white: this.byPlayer.white.toJSON(),
        }
    }

    static fromJSON(json: Record<Player, any>): Hands {
        return new Hands({
            black: Hand.fromJSON(json.black),
            white: Hand.fromJSON(json.white),
        })
    }
}
