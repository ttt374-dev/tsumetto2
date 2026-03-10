import { Box, Stack } from "@mui/material";
import { Position, Hand, KanjiToPieceItem, type PieceType, Piece, Board, type Player, Square, Move } from "@/domain/kif/entity";
import { numberToKanjiTwoDigits } from "../../../common/utils/numberToKanji";

import styles from "./BoardView.module.css";
import { formatPlayer } from "./MovesView";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useReplayStore } from "../../hooks/useReplayStore";
import { useBoardInputStore } from "../../hooks/useBoardInputStore";
import { fromPairs } from "lodash";

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
            className={selected ? styles.selected : ""}>
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
    return (
        <div>
            {formatPlayer(owner)}
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

    //const [tryMoveResult, setTryMoveResult] = useState<TryMoveResult | null>(null)
    //const plyIndex = useReplayStore(s=>s.plyIndex)
    const solvePhase = useReplayStore(s=>s.solvePhase)
    const player = useReplayStore(s=>s.player)
    const selectSquare = useBoardInputStore(s => s.selectSquare)
    const tryMove = useReplayStore(s => s.tryMove)
    const selectedState = useBoardInputStore(s => s.selectedState)
    const mistakes = useReplayStore(s=>s.mistakes)
    const unselect = useBoardInputStore(s=>s.unselect)
    //const moveToSquare = useBoardInputStore(s=>s.moveToSquare)
    //const position = useReplayStore(s=>s.position)
    //const tryMoveResult = useRef<TryMoveResult | null>(null)
    const toast = useToast()
    
    useEffect(() => {
        if (solvePhase === "completed") {
            toast({message: "詰みです！"})
        }
    }, [solvePhase])
    useEffect(()=>{
        if (mistakes===0) return
        toast({message: `不正解: ${mistakes}`})
        unselect()
    }, [mistakes])
    

    const handleSquareClick = (file: number, rank: number) => {
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
                tryMove(move)
                unselect()
                break;
            case "promotionConfirm":  // 成るか成らないのか選択
                break;

        }
        //moveToSquare({file: file, rank: rank})
        /*
        const piece = position.board.get(file, rank)
        if (!selectedState) {
            if (piece?.owner === "black") {
                selectSquare({file, rank})
            }
            return
        }

        if (piece?.owner === "black") {
            selectSquare({file, rank})
            return
        }
        console.log("squareclick", selectedState)
        if (selectedState.type !== "board" && selectedState.type !== "hand") return
        const from = selectedState.type === "board" ? selectedState.square : null
        const pieceType = selectedState.type === "board" ? position.board.get(selectedState.square.file, selectedState.square.rank)?.type
            : selectedState.pieceType
        if (!pieceType) throw new Error
        const move = new Move(from, {file, rank}, pieceType)
        tryMove(move)
        */
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

function formatHand(hand: Hand): string {
    const parts: string[] = [];

    const kanjikeys = Object.entries(KanjiToPieceItem)
        .filter(([key, item]) => !item.promoted && key !== "王" && key !== "玉")
        .map(([key]) => key as PieceType)
        .reverse(); // 逆順

    kanjikeys.forEach(kanjipieceType => {
        const item = KanjiToPieceItem[kanjipieceType]
        const count = hand.count(item.type);
        if (count > 0) {
            const suffix = count > 1 ? (numberToKanjiTwoDigits(count) ?? count.toString()) : ""
            parts.push(`${kanjipieceType}${suffix}`);
        }
    });
    //console.log(parts)        
    return parts.length === 0 ? "なし" : parts.join(" ");
}
export default BoardView;
