import type { KifData } from "@/domain/kif/entity"
import type { MateBucket } from "@/domain/problem/service/query/QueryState"

/*
export const matchMateLength = (kif: KifData, mateFilter?: MateLengthFilter) => {
    if (!mateFilter || kif.moves.length == null) {
        return true
    }

    switch (mateFilter.mode) {
        case "eq":
            return kif.moves.length === mateFilter.length
        case "lte":
            return kif.moves.length <= mateFilter.length
        case "gte":
            return kif.moves.length >= mateFilter.length
    }
}
*/
export function matchMateBuckets(
  //kif: KifData,
  mateLength: number,
  buckets?: MateBucket[]
): boolean {
  if (!buckets || buckets.length === 0) return true
  //const mateLength = kif.moves.length
  if (mateLength === undefined) return false

  return buckets.some(bucket => {    
    switch (bucket) {
      case "lte3":
        return mateLength <= 3
      case "eq5":
        return mateLength === 5
      case "eq7":
        return mateLength === 7
      case "gte9":
        return mateLength >= 9
    }
  })
}