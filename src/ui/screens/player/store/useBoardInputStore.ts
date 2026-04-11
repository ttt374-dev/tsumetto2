import { create } from "zustand"

import { type Square, type PieceType, type Player, Board, Position} from "@/domain/kif/entity"
import type { Intent } from "@/domain/game/intentResolver";
import { getCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore";
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";

export type Selection =
    | { type: "none" }
    | { type: "board"; square: Square }
    | { type: "hand"; pieceType: PieceType; owner: Player }

type BoardInputStore = {
    selection: Selection

    clickSquare: (sq: Square) => Intent | null
    clickHandPiece: (piece: PieceType, owner: Player) => void
    clear: () => void
}


export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    //state: { type: "idle"},
    selection: { type: "none" },

    clickSquare: (sq) => {
        const position = getCurrentPosition()
        const selection = get().selection
        const piece = position.board.get(sq)
        
        //const userplayer = "black"
        const gameState = useGameStore.getState()
        const userplayer = gameState.userSide
        //const ply = useReplayStore.getState().ply
        //const position = buildUntilPly(gameState.initialPosition, gameState.moves, ply)
        //console.log("userplayer", userplayer)
        

        switch(selection.type){
            case "none":
                if (!piece) return null
                if (piece.owner !== userplayer || position.sideToMove != userplayer) return null
                set({ selection: {type: "board", square: sq}})
                return null            
                
            case "board": // 盤面→盤面                
                if (sq.equals(selection.square)){
                    set({ selection: { type: "none" } })    
                    return null 
                }
                if (piece?.owner === userplayer) return null
                return { type: "move", from: selection.square, to: sq, promote: false }
            case "hand":  // 持ち駒→盤面
                set({ selection: { type: "none" } })
                return { type: "drop", pieceType: selection.pieceType, to: sq }                       
        }
    },

    clickHandPiece: (pieceType, owner) => {
        const selection = get().selection
        /*
        if (selection.type === "hand"){
            set({selection: { type: "none"}})
            return
        }*/
        if (selection.type === "hand" && selection.pieceType === pieceType){
            set({selection: { type: "none"}})
            return
        }
        set({ selection: { type: "hand", pieceType: pieceType, owner: owner}})        

    },    
    clear: () => {
        set({selection: { type: "none"}})
    }

}))