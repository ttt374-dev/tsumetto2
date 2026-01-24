import { Problem } from "@/domain/problem/Problem";
import { describe, expect, it } from "vitest";
import { applyFilter } from "../applyFilter";
import { DefaultFilterState } from "../filter";
import { KifData, Move } from "@/domain/kif/types";

/*
describe("filter", ()=> {
    it ("star only", () => {
        const problems = [
            Problem.create({id: "001", starred: true}),
            Problem.create({id: "002", starred: false}),
        ]
        const filter = {...DefaultFilterState, starredOnly: true}
        const filtered = applyFilter(problems,  filter)
        expect(filtered.map(e=>e.problem.id)).toEqual(["001"])
    
    })
    it("mate bucket", () => {
        const moves2 =[new Move(null, {file: 1, rank:1}, "pawn"),
            new Move(null, {file:1, rank:1}, "pawn")]

        
    })
})

*/