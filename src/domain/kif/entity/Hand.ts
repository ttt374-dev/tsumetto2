import type { ApplyMoveError } from "@/domain/kif/entity/Position"
import { Piece, type PieceType, type Player, } from "./Piece"
import type { Result } from "@/shared/result"

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
    ///
    isEmpty(): boolean {
        return Object.values(this.counts).every(v => v === 0)
    }
    //dump() {
    //    this.counts
    //}
    // 指定した駒の枚数を返す
    count(pieceType: PieceType): number {
        return this.counts[pieceType]
    }

    // 駒を追加して新しい Hand を返す（Immutable）
    add(pieceType: PieceType, n: number = 1): Result<Hand, ApplyMoveError> {
        return { ok: true, value: new Hand({
            ...this.counts,
            [pieceType]: this.count(pieceType) + n
        })}
    }

    // 駒を減らして新しい Hand を返す（Immutable）
    remove(pieceType: PieceType, n: number = 1): Result<Hand, ApplyMoveError> {        
        const current = this.count(pieceType)
        //if (current < n) throw new Error(`Not enough pieces: ${pieceType}`)
        console.log("remove", pieceType, current, n)
        if (current < n) return { ok: false, error: { code: "not-enough-piece", pieceType} }
        return { ok: true, value: new Hand({
            ...this.counts,
            [pieceType]: current - n
        })}
    }

    toObject(): Record<PieceType, number> {
        return { ...this.counts }
    }

    // JSON 用にオブジェクト化
    toDTO(): Record<PieceType, number> {
        return this.toObject()
    }

    // JSON から復元
    static fromDTO(obj: Partial<Record<PieceType, number>>): Hand {
        return new Hand(obj)
    }
}


//export type HandDTO = Partial<Record<PieceType, number>>
export type HandDTO = Record<PieceType, number>

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

    add(player: Player, pieceType: PieceType): Result<Hands, ApplyMoveError> {
        const res = this.byPlayer[player].add(pieceType)
        if (!res.ok) return res
        return { ok: true, value: new Hands({
            ...this.byPlayer,
            [player]: res.value,
        })}
    }

    remove(player: Player, pieceType: PieceType): Result<Hands, ApplyMoveError> {
        const hand = this.byPlayer[player]
        console.log("remove hands", player, pieceType, hand.toDTO())
        
        
        const res = this.byPlayer[player].remove(pieceType)
        if (!res.ok) return res
        return { ok: true, value: new Hands({
            ...this.byPlayer,
            [player]: res.value,
        })}
    }

    // serialize
    toDTO(): Record<Player, ReturnType<Hand["toDTO"]>> {
        return {
            black: this.byPlayer.black.toDTO(),
            white: this.byPlayer.white.toDTO(),
        }
    }

    static fromDTO(json: Record<Player, any>): Hands {
        return new Hands({
            black: Hand.fromDTO(json.black),
            white: Hand.fromDTO(json.white),
        })
    }
}
