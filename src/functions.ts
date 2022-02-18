import {CellType} from "./types/cell";
import {Arena} from "./types/common";

export const generateCells = (left: number, right: number): number[][] => {
    const arr = [];
    for (let i = 0; i < left; i++)
        for (let j = 0; j < right; j++)
            arr.push([i, j]);

    return arr
}

export const generateArena = (width: number, height: number): Arena =>
    Array(height).fill(null).map(_ => Array(width).fill(null).map(_ => CellType.EMPTY));
