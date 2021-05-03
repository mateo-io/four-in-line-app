import React from "react";
import GameView from "./GameView";

export type Player = 1 | 2;
export type Cell = Player | 0;
type Row = [Cell, Cell, Cell, Cell, Cell, Cell, Cell]; // 7 total
export type Column = [Cell, Cell, Cell, Cell, Cell, Cell]; // 6 total
export type ColumnArray = Array<Column>;

type GameProps = {};
type GameState = {
  columns: ColumnArray;
  currentPlayerTurn: Player;
  winner: Player | null;
};

const COLUMN_LENGTH = 6;
const INITIAL_COLUMN = new Array(COLUMN_LENGTH).fill(0);
const INITIAL_COLUMN_ARRAY = new Array(7).fill(INITIAL_COLUMN) as ColumnArray;

export default class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);

    // make a copy of the array
    const columns = [...INITIAL_COLUMN_ARRAY];

    this.state = {
      columns,
      currentPlayerTurn: 1,
      winner: null,
    };
  }

  executePlayerMove = (player: Player) => (columnIndex: number) => {
    const { columns, winner } = this.state;

    if (winner) {
      console.log(`Failed to execute move as there's already a winner`);
      return;
    }

    const selectedColumn: Column = columns[columnIndex];
    const selectedColumnMoves = selectedColumn.filter(
      (cell: Cell) => cell !== 0
    );
    let updatedColumn;

    if (selectedColumnMoves.length == selectedColumn.length) {
      console.warn(`this column is full. cannot execute a move`);
      return;
    }

    // add latest move move to the column array with all the moves
    selectedColumnMoves.push(player);

    // update array to return
    updatedColumn = selectedColumnMoves;

    while (updatedColumn.length < COLUMN_LENGTH) {
      updatedColumn.push(0);
    }

    // update the whole columns array with this current modified column
    const updatedColumns = columns.map((column: Column, index: number) =>
      index == columnIndex ? updatedColumn : column
    );

    this.setState({ columns: updatedColumns }, () => this.afterMoveExecution());
  };

  afterMoveExecution = () => {
    const didSomeoneWin = this.didSomeoneWin();

    if (didSomeoneWin) {
      this.setState({ winner: didSomeoneWin });
    }

    const nextPlayer = this.state.currentPlayerTurn === 1 ? 2 : 1;
    this.setState({ currentPlayerTurn: nextPlayer });
  };

  clearBoard = () => {
    this.setState({ currentPlayerTurn: 1, columns: INITIAL_COLUMN_ARRAY });
  };

  didSomeoneWin = (): Player | false => {
    const { columns } = this.state;
    const rows = [];

    for (let i = 0; i < COLUMN_LENGTH; i++) {
      const currentRow = columns.map((col: Column) => col[i]);
      rows.push(currentRow);
    }

    const horizontalFour = this.didSomeoneWinRowLikeObject(rows);

    if (horizontalFour) {
      return horizontalFour;
    }

    const verticalFour = this.didSomeoneWinRowLikeObject(columns);

    if (verticalFour) {
      return verticalFour;
    }

    // TODO -> add diagonals check in case a player completed a diagonal
    // const rightLeaningDiagonals = [rows[0]]
    // let diagonalFour = false;

    return false;
  };

  didSomeoneWinRowLikeObject = (object: Row[] | Column[]): Player | false => {
    let winner;

    object.forEach((row: Row | Column) => {
      // variables used to calculate
      let latestPlayer;
      let consecutiveMoves = 0;

      row
        .filter((cell) => cell !== 0)
        .forEach((cell) => {
          if (latestPlayer === undefined) {
            latestPlayer = cell;
            consecutiveMoves = 1;
          } else if (latestPlayer == cell) {
            consecutiveMoves += 1;
          } else {
            latestPlayer = cell;
            consecutiveMoves = 1;
          }

          if (consecutiveMoves == 4) {
            winner = latestPlayer;
          }
        });
    });

    if (winner) {
      console.log(`returning winner:${winner}`);
      return winner;
    }

    return false;
  };

  render() {
    const { columns, currentPlayerTurn, winner } = this.state;
    return (
      <GameView
        columns={columns}
        currentPlayerTurn={currentPlayerTurn}
        executePlayerMove={this.executePlayerMove}
        winner={winner}
      />
    );
  }
}
