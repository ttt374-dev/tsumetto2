import { Position, type PositionDTO } from "./Position";
import { Move, type MoveDTO } from "./Move";

export type KifHeader = Record<string, string>

export type KifDataDTO = {
  headers: KifHeader
  initialPosition: PositionDTO,
  moves: MoveDTO[]  
}

export class KifData {
    headers: KifHeader
    initialPosition: Position
    moves: Move[]

    constructor(headers: KifHeader, initialPosition: Position, moves: Move[] = []) {
        this.headers = headers
        this.initialPosition = initialPosition
        this.moves = moves

        this.validate()
    }
    static create(){
      return new KifData({}, Position.create(), [])
    }
    private validate() {
        // 必須ヘッダチェック
        //if (!this.headers["手合割"]) throw new Error("手合割が指定されていません")
        //if (!this.initialPosition) throw new Error("初期盤面がありません")
        // 手合割と初期盤面の整合性チェックもここで可能
    }

    //addMove(move: Move) {
    //    this.moves.push(move)
    //}

    // KifData を JSON に変換
    toDTO(): KifDataDTO {
        return {
            headers: this.headers,
            initialPosition: this.initialPosition.toDTO(),
            moves: this.moves.map(m => m.toDTO())
        }
    }

    static fromDTO(json: KifDataDTO): KifData {
        console.log("kif data from dto", json.initialPosition)
        const initialPosition = Position.fromDTO(json.initialPosition)
        const moves = json.moves.map((m: any) => Move.fromDTO(m))
        return new KifData(json.headers, initialPosition, moves)
    }
}
