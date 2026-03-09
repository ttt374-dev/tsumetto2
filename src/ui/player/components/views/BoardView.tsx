import { Box, Stack } from "@mui/material";
import { Position, Hand, KanjiToPieceItem, type PieceType, Piece, Board, type Player, Square } from "@/domain/kif/entity";
import { numberToKanjiTwoDigits } from "../../../common/utils/numberToKanji";

import styles from "./BoardView.module.css";
import { formatPlayer } from "./MovesView";
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
    const selected = useReplayStore(s=>s.selected)
    const selectedPieceType = selected && selected.type === "hand" && selected.pieceType

    return (<>
        {
            keys.filter(key => hand.count(key) > 0).map(key => {
                const countString = hand.count(key) > 1 ? numberToKanjiTwoDigits(hand.count(key)) : ""
                return <span onClick={() => onClick?.(key)} className={owner === "black" && selectedPieceType === key ? styles.selected : ""}>
                    {PieceKeyKanjiMapping[key]}{countString}
                </span>
            })
        }
    </>
    )
}

/////////////////////////////
function HandView({ hand, owner }: { hand: Hand, owner: Player, onPieceClick?: () => void }) {
    const selected = useReplayStore(s => s.selected)
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
function SquareView({ piece, file, rank }: {
    file: number
    rank: number
    piece: Piece | null
}
) {
    const selectSquare = useReplayStore(s => s.selectSquare)
    const advancePly = useReplayStore(s => s.advancePly)
    const tryMoveTo = useReplayStore(s => s.tryMoveTo)
    const selected = useReplayStore(s => s.selected)
    const isSelected = selected?.type === "board" && selected?.square.file === file && selected?.square.rank === rank
    if (isSelected) console.log("selected", file, rank)

    const handleSquareClick = () => {
        if (selected) {
            const result = tryMoveTo({ file, rank })

            switch (result.type) {
                case "correct":
                    advancePly()
                    break

                case "finish":
                    alert("正解！")
                    break

                case "incorrect":
                    alert("不正解")
                    break

                case "cancel":
                    break

                case "promotion-choice":
                    //setPromotionDialog(true)
                    window.confirm("成りますか？")
                    break;
            }
        } else {
            if (piece) selectSquare(file, rank)
        }
    }

    return (
        <div
            className={`${styles.cell}  
            ${isSelected && styles.selected}
            ${piece?.owner === 'white' ? styles.white : ''}`}
            onClick={handleSquareClick}
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
                            return (
                                <SquareView
                                    key={Board.squareKey(file, rank)}
                                    file={file}
                                    rank={rank}
                                    piece={piece}
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
