import { Box, Stack } from "@mui/material";
import { Position, Hand, KanjiToPieceItem, type PieceType, Piece, Board, type Player, Square, Move } from "@/domain/kif/entity";
import { numberToKanjiTwoDigits } from "../../../common/utils/numberToKanji";

import styles from "./BoardView.module.css";
import { formatPlayer } from "./MovesView";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useReplayStore } from "../../hooks/useReplayStore";

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

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
const PieceKeyKanjiMapping: Record<string, string> = {
    "pawn": "歩",
    "lance": "香",
    "knight": "桂",
    "silver": "銀",
    "gold": "金",
    "bishop": "角",
    "rook": "飛"
}
function HandPieceView({ hand, owner, onClick }: { 
    hand: Hand, owner: Player, onClick?: (type: PieceType) => void }) {
    const keys: PieceType[] = ["rook", "bishop", "gold", "silver", "knight", "lance", "pawn"]
    const selected = useReplayStore(s=>s.selectedState)
    const selectedPieceType =
        selected?.type === "hand" ? selected.pieceType : null

    return (<>
        {
            keys.map(key => {
                const count = hand.count(key)
                if (count === 0) return null
                const countString = count > 1 ? numberToKanjiTwoDigits(count) : ""
                return <span style={{marginRight: 5}} key={key} onClick={() => onClick?.(key)} 
                    className={owner === "black" && selectedPieceType === key ? styles.selected : ""}
                    
                >
                    {PieceKeyKanjiMapping[key]}{countString}
                </span>
            })
        }
    </>
    )
}

/////////////////////////////
function HandView({ hand, owner }: { hand: Hand, owner: Player }) {
    const selected = useReplayStore(s => s.selectedState)
    const selectHandPiece = useReplayStore(s => s.selectHandPiece)
    const unselect = useReplayStore(s=>s.unselect)
    const handleClick = (piecetype: PieceType) => {
        console.log("hand piece click", piecetype, owner, selected)
        if (owner === "white") return  // 先手のみ選択可
        if (selected){
            if(selected.type === "hand" && selected.pieceType === piecetype){
                console.log("unselected")
                unselect()
            }
        } else {
            selectHandPiece(piecetype, owner)
        }
    }
    return (
        <div>
            {formatPlayer(owner)}
            <HandPieceView hand={hand} owner={owner} onClick={handleClick} />
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
    const selectSquare = useReplayStore(s => s.selectSquare)
    const tryMove = useReplayStore(s => s.tryMove)
    const selectedState = useReplayStore(s => s.selectedState)
    const mistakes = useReplayStore(s=>s.mistakes)
    const unselect = useReplayStore(s=>s.unselect)
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
                            const selected = selectedState?.type === "board" &&
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
