import {Component} from 'react';

import {BoardProps} from '../types/board';
import {generateCells} from "../functions";
import {boardHeight, boardWidth, cellSize} from "../config";
import {GameStage} from "../types/common";
import Cell from "./cell";

import '../styles/board.css';
import {CellType} from "../types/cell";

class Board extends Component<BoardProps> {

    render() {
        const isHidden = this.props.currState.player.name !== this.props.player.name
            && this.props.currState.stage === GameStage.SHIP_PLACEMENT

        if (isHidden)
            return <></>

        const cellList = generateCells(boardWidth, boardHeight).map(
            ([x, y]) => {
                debugger;
                if (this.props.currState.stage === GameStage.GAMEPLAY && this.props.player.cells[x][y] === CellType.HAS_SHIP) {
                    const cellState = this.props.player.name !== this.props.currState.player.name ? CellType.EMPTY : CellType.HAS_SHIP;
                    return <Cell
                        key={`${x}${y}`}
                        cellState={cellState}
                        // @ts-ignore
                        onCellClick={this.props.onCellClick(x, y)}
                    />
                } else {
                    return <Cell
                        key={`${x}${y}`}
                        cellState={this.props.player.cells[x][y]}
                        // @ts-ignore
                        onCellClick={this.props.onCellClick(x, y)}
                    />

                }
            }
        );

        return <div className="board">
            Игрок {this.props.player.name}
            <div className="cell-list"
                 style={
                     {
                         width: `calc(${boardWidth} * ${cellSize})`,
                         height: `calc(${boardHeight} * ${cellSize})`
                     }
                 }>
                {cellList}
            </div>
        </div>;
    }
}

export default Board