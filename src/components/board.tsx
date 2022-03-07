import React, {Component} from 'react';

import Cell from "./cell";
import ActionButton from "./action-button";

import type {BoardProps} from '../types/board';
import {CellCoords, GameStage} from "../types/game-controller";
import {PlayerName} from "../types/player";
import type {Arena} from "../types/common";
import {CellType} from "../types/cell";

import {boardHeight, boardWidth, cellSize} from "../config";

import {generateCoordinatePairs} from "../functions";

import GameState from "../classes/game-state";
import GameController from "../classes/game-controller";
import PlayerController from "../classes/player-controller";

import '../styles/board.css';

class Board extends Component<BoardProps> {
    playerName: PlayerName;
    gameState: GameState;
    arena: Arena;
    getCellType: (cell: CellType, coords: CellCoords) => CellType;
    isTargetCell: (coords: CellCoords) => boolean;
    isBoardVisible: boolean;

    constructor(props: BoardProps) {
        super(props);

        this.playerName = props.playerName;
        this.gameState = props.gameState;
        this.arena = props.arena;


        this.getCellType = GameController.getCellType(this.playerName, props.gameState);
        this.isReadyForNextStage = this.isReadyForNextStage.bind(this);
        this.isTargetCell = PlayerController.isTargetCell(props.gameState, props.playerName);
        this.isBoardVisible = GameController.isBoardVisible(props.gameState, props.playerName);
        this.getMessage = this.getMessage.bind(this);
    }

    isReadyForNextStage() {
        switch (this.gameState.currStage) {
            case GameStage.SHIP_PLACEMENT:
                return !PlayerController.isCanBuild(this.arena)
            case GameStage.GAMEPLAY:
                return !GameController.isTargetEmpty(this.gameState.targetCell)
                    && !GameController.isPlayerActive(this.gameState.currPlayer, this.playerName)
        }
        return false
    }

    getMessage() {
        switch (this.gameState.currStage) {
            case GameStage.SHIP_PLACEMENT:
                return `Осталось расположить кораблей: ${PlayerController.shipsRemainingForBuild(this.arena)}`
            case GameStage.GAMEPLAY:
                if (GameController.isPlayerActive(this.gameState.currPlayer, this.playerName))
                    return 'Ваш ход'
                else {
                    const shipCount = PlayerController.aliveShipsCount(this.arena)
                    const msg = `Осталось ${shipCount} `
                    const div10 = Math.floor(shipCount / 10);
                    if (div10 === 2)
                        return msg + 'корабля'
                    else if (div10 === 1)
                        return msg + 'корабль'
                    else
                        return msg + 'кораблей'
                }

            case GameStage.ENDGAME:
                if (GameController.isPlayerActive(this.gameState.currPlayer, this.playerName))
                    return 'Победа!'
                else
                    return 'Повезёт в другой раз ;)'
        }
    }

    render() {
        if (!this.isBoardVisible) {
            return <></>
        }

        const cellList = generateCoordinatePairs(boardWidth, boardHeight).map(
            coords => {
                const [x, y] = coords;
                const cellType = this.getCellType(this.arena[x][y], coords);

                return <Cell
                    key={`${x}${y}`}
                    cellType={cellType}
                    onCellClick={this.props.onCellClick(coords)}
                />
            }
        );

        return <div className="board">
            <span className="board__player-name">{this.playerName}</span>
            <span className="board__msg">{this.getMessage()}</span>
            <ActionButton
                onNextStage={this.props.onNextStage}
                gameStage={this.gameState.currStage}
                isReadyForNextStage={this.isReadyForNextStage()}
            />
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