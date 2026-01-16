import type { initialReplayState } from "@/application/ReplayFsm/replayReducer";
import { BoardState, type BoardStateDTO } from "./BoardState";
import { Move, type MoveDTO } from "./Move";

export type KifHeader = Record<string, string>

export type KifDataDTO = {
  headers: KifHeader
  initialState: BoardStateDTO,
  moves: MoveDTO[]  
}

export class KifData {
    headers: KifHeader
    initialState: BoardState
    moves: Move[]

    constructor(headers: KifHeader, initialState: BoardState, moves: Move[] = []) {
        this.headers = headers
        this.initialState = initialState
        this.moves = moves

        this.validate()
    }
    static create(){
      return new KifData({}, BoardState.create(), [])
    }
    private validate() {
        // 必須ヘッダチェック
        //if (!this.headers["手合割"]) throw new Error("手合割が指定されていません")
        //if (!this.initialState) throw new Error("初期盤面がありません")
        // 手合割と初期盤面の整合性チェックもここで可能
    }

    //addMove(move: Move) {
    //    this.moves.push(move)
    //}

    // KifData を JSON に変換
    toJSON(): KifDataDTO {
        return {
            headers: this.headers,
            initialState: this.initialState.toJSON(),
            moves: this.moves.map(m => m.toJSON())
        }
    }

    static fromJSON(json: KifDataDTO): KifData {
        const initialState = BoardState.fromJSON(json.initialState)
        const moves = json.moves.map((m: any) => Move.fromJSON(m))
        return new KifData(json.headers, initialState, moves)
    }
}
