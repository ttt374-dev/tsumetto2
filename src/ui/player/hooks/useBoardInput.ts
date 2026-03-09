import { Move, type Position, type Square } from "@/domain/kif/entity"
import { selectPosition, useReplayStore, type SelectedState } from "./useReplayStore"

type InputPhase =
  | "idle"
  | "pieceSelected"
  | "promotionSelect"

export function useBoardInput() {
    const position = useReplayStore(selectPosition)
    const selectedState = useReplayStore(s => s.selectedState)

    const selectSquare = useReplayStore(s => s.selectSquare)
    const clearSelection = useReplayStore(s => s.unselect)
    const tryMove = useReplayStore(s => s.tryMove)

    function clickSquare(file: number, rank: number) {
        const piece = position.board.get(file, rank)

// ① 未選択
    if (!selectedState) {
      if (piece?.owner === "black") {
        selectSquare({ file, rank })
      }
      return
    }

    // ② 同じ駒クリック → 選択変更
    if (piece?.owner === "black") {
      selectSquare({ file, rank })
      return
    }

    // ③ move生成
    const move = buildMove(selectedState, { file, rank }, position)

    if (!move) {
      clearSelection()
      return
    }

    tryMove(move)
  }

  return { clickSquare }
}

//////////////
function buildMove(
  selected: SelectedState,
  to: Square,
  position: Position
): Move | null {

  if (selected.type === "board") {
    const piece = position.board.get(
      selected.square.file,
      selected.square.rank
    )

    if (!piece) return null

    return new Move(
      selected.square,
      to,
      piece.type
    )
  }

  if (selected.type === "hand") {
    return new Move(
      null,
      to,
      selected.pieceType
    )
  }

  return null
}