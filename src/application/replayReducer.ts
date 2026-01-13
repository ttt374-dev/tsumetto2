// replayReducer.ts
export type ReplayAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "RESET" }
  | { type: "MOVE_TO"; index: number };

export type ReplayState = {
  currentPlyIndex: number;
};

export const initialReplayState: ReplayState = {
  currentPlyIndex: 0,
};

export function replayReducer(
  state: ReplayState,
  action: ReplayAction,
  maxIndex: number
): ReplayState {
  switch (action.type) {
    case "NEXT":
      return {
        currentPlyIndex: Math.min(state.currentPlyIndex + 1, maxIndex),
      };

    case "PREV":
      return {
        currentPlyIndex: Math.max(state.currentPlyIndex - 1, 0),
      };

    case "RESET":
      return {
        currentPlyIndex: 0,
      };

    case "MOVE_TO":
      return {
        currentPlyIndex: Math.min(
          Math.max(action.index, 0),
          maxIndex
        ),
      };

    default:
      return state;
  }
}
