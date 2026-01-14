import type { Piece, PieceType } from "./Piece"

export class Hand {
    constructor(
        private readonly counts: Map<PieceType, number>
    ) { }
    static empty(): Hand {
        return new Hand(new Map())
    }
    add(piece: Piece): Hand {
        const base = piece.demote().type
        const next = new Map(this.counts)
        next.set(base, (next.get(base) ?? 0) + 1)
        return new Hand(next)
    }

    remove(type: PieceType): Hand {
        const count = this.counts.get(type) ?? 0
        if (count <= 0) throw new Error("no piece in hand")
        const next = new Map(this.counts)
        next.set(type, count - 1)
        return new Hand(next)
    }
    /////////////
    // serialize
    toJSON(): HandDTO {
        return Object.fromEntries(this.counts)
    }

    static fromJSON(dto: HandDTO): Hand {
        return new Hand(
            new Map(
                Object.entries(dto)
                    .filter(([, v]) => (v ?? 0) > 0) as [PieceType, number][]
            )
        )
    }
}

export type HandDTO = Partial<Record<PieceType, number>>



export type Hands = {
    black: Hand, white: Hand
}
