// utils/parser/handParser.test.ts
import { describe, it, expect } from 'vitest'
import { parseHandString } from "../kifParseHand";
import { createEmptyHand } from '../../factory'

//import { formatHand } from './kifParseHand';

describe("parseHandText", () => {
  it("単数と複数を正しく解析できる", () => {
    const result = parseHandString("金 銀二 桂 歩");

    expect(result).toEqual({
      歩: 1,
      香: 0,
      桂: 1,
      銀: 2,
      金: 1,
      角: 0,
      飛: 0,
      玉: 0,
    });
  });

  it("数字なしは1になる", () => {
    const result = parseHandString("歩");

    expect(result.歩).toBe(1);
  });

  it("空文字はすべて0", () => {
    const result = parseHandString("");

    expect(result).toEqual({
      歩: 0,
      香: 0,
      桂: 0,
      銀: 0,
      金: 0,
      角: 0,
      飛: 0,
      玉: 0,
    });
  });
  it("format", () => {
    const hand = createEmptyHand()
    hand["歩"] = 6
    hand["金"] = 2
    hand["飛"] = 1

    //expect(formatHand(hand)).toEqual(
    //  "飛 金二 歩六"
    //)
  })
})

