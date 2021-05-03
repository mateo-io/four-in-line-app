import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Touchable,
} from "react-native";
import { Column, ColumnArray, Cell, Player } from "./Game";
import tailwind from "tailwind-rn";

type GameViewProps = {
  columns: ColumnArray;
  currentPlayerTurn: Player;
  winner: Player | null;
  executePlayerMove: (player: Player) => (columnIndex: number) => void;
};

export default class GameView extends React.Component<GameViewProps> {
  renderColumn(column: Column, columnIndex: number) {
    const { executePlayerMove, currentPlayerTurn } = this.props;

    return column.map((cell: Cell, cellIndex: number) => {
      let cellStyle = "w-5 h-5 m-2 border border-gray-900 rounded-full";

      if (cell == 1) {
        cellStyle += " bg-blue-500";
      }
      if (cell == 2) {
        cellStyle += " bg-red-500";
      }

      return (
        // <View style={tailwind("flex-col-reverse")}>
        <View key={cellIndex} style={tailwind("w-10")}>
          <TouchableWithoutFeedback
            onPress={() => executePlayerMove(currentPlayerTurn)(columnIndex)}
          >
            <View style={tailwind(cellStyle)} />
          </TouchableWithoutFeedback>
        </View>
        /* </View> */
      );
    });
  }

  renderStatus() {
    const { winner, currentPlayerTurn } = this.props;
    if (winner) {
      return <Text>Player {winner} won!</Text>;
    }

    return <Text>Player {currentPlayerTurn} turn</Text>;
  }

  render() {
    const { columns } = this.props;

    return (
      <View style={tailwind("h-full w-full flex items-center")}>
        <h1>hola</h1>
        <View style={tailwind("flex flex-row bg-gray-100")}>
          {columns.map((column: Column, columnIndex: number) => {
            return (
              <View key={columnIndex} style={tailwind("flex-col-reverse")}>
                {this.renderColumn(column, columnIndex)}
              </View>
            );
          })}
        </View>

        <View>{this.renderStatus()}</View>
      </View>
    );
  }
}
