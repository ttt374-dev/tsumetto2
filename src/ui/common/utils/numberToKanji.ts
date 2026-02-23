const digitsKanji = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

export function numberToKanjiTwoDigits(num: number): string {
    if (num < 0 || num > 99) {
        throw new Error("0〜99 の整数のみ対応しています");
    }

    if (num < 10) {
        return digitsKanji[num];
    }

    const tens = Math.floor(num / 10);
    const ones = num % 10;
    let result = "";

    // 十の位
    if (tens === 1) {
        result += "十";
    } else {
        result += digitsKanji[tens] + "十";
    }

    // 一の位
    if (ones !== 0) {
        result += digitsKanji[ones];
    }

    return result;
}
