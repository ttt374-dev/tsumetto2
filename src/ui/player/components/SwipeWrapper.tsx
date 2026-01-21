
import { useSwipeable, type SwipeableHandlers } from "react-swipeable";
import { Stack, Box } from '@mui/material'

type SwipeActions = {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
};

export function SwipeWrapper({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions: SwipeActions;
}) {
  const handlers: SwipeableHandlers = useSwipeable({
    onSwipedLeft: actions.onLeft,
    onSwipedRight: actions.onRight,
    onSwipedUp: actions.onUp,
    onSwipedDown: actions.onDown,
    trackMouse: true, // PCでもマウスでスワイプ可能
    preventScrollOnSwipe: true,
  });

  return <Box {...handlers} sx={{userSelect: "none"}}>{children}</Box>;
}