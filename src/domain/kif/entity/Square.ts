/*
export type Square = {
    file: number, rank: number,
}
    */
export type SquareNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export function isSquareNumber(n: number): n is SquareNumber {
    return n >= 1 && n <= 9
}

export class Square {
    private constructor(
        readonly file: SquareNumber,
        readonly rank: SquareNumber,
    ) { }
    static create(file: number, rank: number): Square {
        if (!isSquareNumber(file) || !isSquareNumber(rank)) {
            throw new Error(`Invalid square: ${file}, ${rank}`)
        }
        return new Square(file, rank)
    }
    static tryCreate(file: number, rank: number): Square | undefined {
    if (!isSquareNumber(file) || !isSquareNumber(rank)) {
        return undefined
    }
    return Square.create(file, rank)
}

    equals(sq: Square): boolean {
        return this.file === sq.file && this.rank === sq.rank
    }
    /*
        get key(): string {
            //return `${this.file},${this.rank}`
            return Board.squareKey(this.file, this.rank)
        }
    */
}
