import { Box, Stack } from "@mui/material";

import { Position, Hand, KanjiToPieceItem, type PieceType, Piece, Board, type Player, Square, Move, type MoveDTO } from "@/domain/kif/entity";
import { numberToKanjiTwoDigits } from "../../../common/utils/numberToKanji";
import styles from "./BoardView.module.css";
import { formatPlayer } from "./MovesView";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useReplayStore } from "../../hooks/useReplayStore";
import { useBoardInputStore } from "../../hooks/useBoardInputStore";

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

const PieceKeyKanjiMapping: Record<string, string> = {
    "pawn": "歩",
    "lance": "香",
    "knight": "桂",
    "silver": "銀",
    "gold": "金",
    "bishop": "角",
    "rook": "飛"
}
function HandPieceView({ pieceType, selected, count, onClick }: { 
    pieceType: PieceType
    selected: boolean
    count: number
    onClick?: () => void
}) {
    const countString = count > 1 ? numberToKanjiTwoDigits(count) : ""
    return (
        <span style={{ marginRight: 5 }} onClick={() => onClick?.()}            
            className={`${styles.handpiece}  ${selected ? styles.selected : ""}`}>
            {PieceKeyKanjiMapping[pieceType]}{countString}
        </span>)
}

/////////////////////////////
function HandView({ hand, owner }: { hand: Hand, owner: Player }) {
    const selectedState = useBoardInputStore(s => s.selectedState)
    const selectHandPiece = useBoardInputStore(s => s.selectHandPiece)
    const unselect = useBoardInputStore(s=>s.unselect)
    const handleHandpieceClick = (piecetype: PieceType) => {
        if (owner !== "black") return
        switch(selectedState.type){
            case "idle":
                console.log("select hand piece", piecetype, owner)
                selectHandPiece(piecetype, owner)
                break;
            case "selected":
                if (selectedState.source === "hand" && selectedState.pieceType === piecetype) {
                    console.log("unselected")
                    unselect()
                }
                break;
        }

    }
    const keys: PieceType[] = ["rook", "bishop", "gold", "silver", "knight", "lance", "pawn"]
    //console.log("is empty", hand.isEmpty())
    return (
        <div>
            {formatPlayer(owner)}
            { hand.isEmpty() && "なし"}
            {
            keys.map(key => {
                const count = hand.count(key)
                if (count === 0) return null
                const selected = selectedState.type === "selected" &&
                    selectedState.source === "hand" &&
                    selectedState.pieceType === key &&
                    owner === "black"
                    
                return (
                    <HandPieceView 
                        pieceType={key} selected={selected} count={count} 
                        onClick={() => handleHandpieceClick(key)}/>)
                })
            }
        </div>
    )
}
function SquareView({ piece, selected, onClick }: {
    piece: Piece | null
    selected: boolean
    onClick?: () => void
}
) {
    return (
        <div
            className={`${styles.cell}  
            ${selected && styles.selected}
            ${piece?.owner === 'white' ? styles.white : ''}`}
            onClick={onClick}
        >
            {piece ? piece.format() : null}
        </div>
    )
}
///////////////////////////////
function BoardView({ position }: { position: Position }) {
    const { board, hands } = position
    const ranks = [...Array(9)].map((_, i) => i + 1)   //   1 → 9
    const files = [...Array(9)].map((_, i) => 9 - i)   // 9 → 1（将棋表記） ???

    
    const player = useReplayStore(s=>s.player)
    const selectSquare = useBoardInputStore(s => s.selectSquare)
    const tryMove = useReplayStore(s => s.tryMove)
    const selectedState = useBoardInputStore(s => s.selectedState)    
    const unselect = useBoardInputStore(s=>s.unselect)      

    const promotable = new Set([
        "pawn",
        "lance",
        "knight",
        "silver",
        "bishop",
        "rook"
    ])

    const canPromote = (move: Move, player: Player) => {
        if (!move.from) return false
        if (!promotable.has(move.pieceType)) return false

        const from = move.from.rank
        const to = move.to.rank

        if (player === "black") {
            return from <= 3 || to <= 3
        } else {
            return from >= 7 || to >= 7
        }
    }
    const handleSquareClick = (file: number, rank: number) => {
        console.log("selected state", selectedState)
        switch(selectedState.type){
            
            case "idle":   // 未選択
                if (player ==="white") return
                const piece = position.board.get(file, rank)
                if (!piece || piece.owner !== "black") return // 黒の駒を選択したときのみ
                selectSquare({file: file, rank: rank})
                break;
            case "selected":  // 駒が選択されている状態
                let from: Square | null = null
                let pieceType: PieceType | undefined = undefined

                switch(selectedState.source){
                    case "board":
                        from = selectedState.square
                        // 同じセルが選択されたときはキャンセル
                        if (from.file === file && from.rank === rank) { 
                            unselect()
                            return
                        }
                        pieceType = position.board.get(selectedState.square.file, selectedState.square.rank)?.type                 
                        if (!pieceType) throw new Error
                        break;
                    case "hand":
                        pieceType = selectedState.pieceType
                        break;
                }
                
                const move = new Move(from, { file, rank}, pieceType)
                if (canPromote(move, "black")){
                    //pendingPromotion(move)
                    const res = window.confirm(`成りますか？: ${PieceKeyKanjiMapping[move.pieceType]}`)
                    const dto: MoveDTO = { ...move.toDTO(), promote: res }
                    const newMove = Move.fromDTO(dto)
                    tryMove(newMove)
                    //promotionConfirmed(move, res)
                } else {
                    tryMove(move)
                }
                unselect()
                break;

        }
    }    

    return (
        <Stack justifyContent="center">
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView hand={hands.get("white")} owner="white" />

                <Box className={styles.board}>
                    {/* 上の筋表示 */}
                    <div></div>
                    {fileLabels.map((f, i) => (
                        <div key={i} className={styles.fileLabel}>{f}</div>
                    ))}
                    <div></div>
                    {/* 盤面 + 左側の段表示 */}
                    {ranks.flatMap(rank => {
                        const cells = files.map(file => {
                            const piece = board.get(file, rank)
                            const selected = selectedState.type === "selected" && 
                                selectedState.source === "board" &&
                                selectedState.square.file === file &&
                                selectedState.square.rank === rank
                            return (
                                <SquareView
                                    key={Board.squareKey(file, rank)}
                                    piece={piece}
                                    selected={selected}
                                    onClick={() => handleSquareClick(file, rank)}
                                />
                            )
                        })
                        const empty = <div></div>
                        const rankLabel = <div className={styles.rankLabel}>
                            {rankLabels[rank - 1]}
                        </div>
                        return [empty, ...cells, rankLabel,]
                    }

                    )}
                </Box>
                {/* 持駒表示 */}
                <HandView hand={hands.get("black")} owner="black" />
            </Box>
        </Stack >
    )
}

export default BoardView;
