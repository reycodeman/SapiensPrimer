import React from "react";
import { SafeAreaView } from "react-native";
import Board from "./components/Board";
import { GameProvider } from "./state/GameState";
import GameScreen from "./screens/GameScreen";

export default function App() {
  return (
    <GameProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
        <GameScreen/>
      </SafeAreaView>
    </GameProvider>
  );
}
