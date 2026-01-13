// useReplayView.ts
import { useReducer, useMemo } from "react";
import type { KifContent } from "@/domain/kif/types";
import { buildBoardUntil } from "@/domain/kif/builder/buildBoardUntil";
import { initialReplayState, replayReducer, type ReplayAction } from "@/application/replayReducer";

export function useBoardReplay(kifContent: KifContent) {
  const { board: initialBoard, hands: initialHands, moves } = kifContent;

  const [state, dispatch] = useReducer(
    (s: typeof initialReplayState, a: ReplayAction) =>
      replayReducer(s, a, moves.length),
    initialReplayState
  );

  const { board, hands } = useMemo(() => {
    return buildBoardUntil(
      initialBoard,
      initialHands,
      moves,
      state.currentPlyIndex
    );
  }, [initialBoard, initialHands, moves, state.currentPlyIndex]);

  return {
    // derived state
    board,
    hands,
    moves,

    // FSM state
    currentPlyIndex: state.currentPlyIndex,

    // raw dispatcher
    dispatch,

    // semantic helpers（UI向け）
    advancePly: () => dispatch({ type: "NEXT" }),
    retreatPly: () => dispatch({ type: "PREV" }),
    resetPly: () => dispatch({ type: "RESET" }),
    moveToPly: (index: number) =>
      dispatch({ type: "MOVE_TO", index }),
  };
}
