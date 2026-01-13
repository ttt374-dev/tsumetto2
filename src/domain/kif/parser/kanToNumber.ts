export const kanToNumber: Record<string, number> = {
  "一": 1,
  "二": 2,
  "三": 3,
  "四": 4,
  "五": 5,
  "六": 6,
  "七": 7,
  "八": 8,
  "九": 9,
};

export const NumberToKanji: Record<number, string> = {
  1: "",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "七",
  8: "八",
  9: "九",
};


export function zenkakuToNumber(ch: string): number {
  const code = ch.charCodeAt(0);
  if (code >= 0xFF10 && code <= 0xFF19) {
    return code - 0xFF10 + 0;
  }
  return parseInt(ch, 10);
}
