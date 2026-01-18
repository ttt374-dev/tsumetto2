// useReplayView.ts
import { useReducer, useMemo } from "react";
import { initialReplayState, replayReducer, type ReplayAction } from "@/application/ReplayFsm/replayReducer";
import { buildUntilPly } from "@/domain/kif/buildUntilPly";
import type { KifData } from "@/domain/kif/types";

export function useReplayFsm(kifData: KifData) {
  //const { board: initialBoard, hands: initialHands, history } = kifData;
  const { initialPosition: initialPosition, moves} = kifData

  const [state, dispatch] = useReducer(
    (s: typeof initialReplayState, a: ReplayAction) =>
      replayReducer(s, a, moves.length),
    initialReplayState
  );

  const history = {
    initial: initialPosition,
    moves: moves
  }
  const { board, hands } = useMemo(() => {
    return buildUntilPly(history, state.currentPlyIndex);
  }, [history, state.currentPlyIndex]);

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
