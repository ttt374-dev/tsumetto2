export type PieceType = {
  name: string, 
  display: string,
  promoted: boolean,
  base: string | null
}
export const PieceTypes: Record<string, PieceType> = {
  // 歩
  "歩": {
    name: "歩",
    display: "歩",
    promoted: false,
    base: null,
  },
  "歩成": {
    name: "歩",
    display: "と",
    promoted: true,
    base: '歩'
  },
  "と": {
    name: "成歩",
    display: "と",
    promoted: true,
    base: "歩",
  },

  // 香
  "香": {
    name: "香",
    display: "香",
    promoted: false,
    base: null,
  },
  "成香": {
    name: "成香",
    display: "杏",
    promoted: true,
    base: "香",
  },
  "香成": {
    name: "成香",
    display: "杏",
    promoted: true,
    base: "香",
  },  "杏": {
    name: "成香",
    display: "杏",
    promoted: true,
    base: "香",
  },

  // 桂
  "桂": {
    name: "桂",
    display: "桂",
    promoted: false,
    base: null,
  },
  "成桂": {
    name: "成桂",
    display: "圭",
    promoted: true,
    base: "桂",
  },
  "桂成": {
    name: "成桂",
    display: "圭",
    promoted: true,
    base: "桂",
  },

  "圭": {
    name: "成桂",
    display: "圭",
    promoted: true,
    base: "桂",
  },
  // 銀
  "銀": {
    name: "銀",
    display: "銀",
    promoted: false,
    base: null,
  },
  "成銀": {
    name: "成銀",
    display: "全",
    promoted: true,
    base: "銀",
  },
  "全": {
    name: "成銀",
    display: "全",
    promoted: true,
    base: "銀",
  },
  "銀成": {
    name: "銀成",
    display: "全",
    promoted: true,
    base: "銀",
  },
  // 金
  "金": {
    name: "金",
    display: "金",
    promoted: false,
    base: null,
  },

  // 角
  "角": {
    name: "角",
    display: "角",
    promoted: false,
    base: null,
  },
  "角成": {
    name: "角",
    display: "馬",
    promoted: true,
    base: null,
  },
  "馬": {
    name: "馬",
    display: "馬",
    promoted: true,
    base: "角",
  },

  // 飛
  "飛": {
    name: "飛",
    display: "飛",
    promoted: false,
    base: null,
  },
  "飛成": {
    name: "飛",
    display: "龍",
    promoted: true,
    base: null,
  },
  "龍": {
    name: "龍",
    display: "龍",
    promoted: true,
    base: "飛",
  },

  // 玉
  "玉": {
    name: "玉",
    display: "玉",
    promoted: false,
    base: null,
  },
} as const;


