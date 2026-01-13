import type { KifHeader } from "../types";

export function parseHeader(lines: string[]){
  const header: KifHeader = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;          // 空行はスキップ
    if (/^\d+\s/.test(trimmed)) break;     // 手順行が始まったら終了

    const match = trimmed.match(/^(.+?)：(.+)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      header[key] = value;
    }
    
  }
  return header
}