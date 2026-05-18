import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { Table3D } from "./components/table/Table3D";
import { useTelegramContext } from "./providers/telegram/TelegramContext";

function App() {
  const { user, ready } = useTelegramContext();
  const {
    connect,
    players,
    currentTurn,
    hand,
    playCard,
    drawCard,
    myPlayerId,
  } = useGameStore();
  const userId = user?.id?.toString();
  const username = user?.username || user?.first_name || "Player";

  useEffect(() => {
    const wsUrl = "ws://localhost:3001";
    if (ready && user) {
      console.log('🚀 Connecting to WebSocket...');
      connect(wsUrl, "uno", username, userId);
    }
  }, [ready, user, connect, username, userId]);

  const isMyTurn = myPlayerId === currentTurn;
  const playerList = Array.from(players.values());

  useEffect(() => {
    console.log(">> Players in game:", playerList);
    console.log(">> Current turn:", players.get(currentTurn)?.name);
    console.log(">> Your hand:", hand);
  }, [players, currentTurn, hand, playerList]);

  return (
    <div className="relative h-screen w-screen bg-gray-900 text-white overflow-hidden">
      {/* 2D UI Overlay */}
      <div className="absolute top-0 left-0 z-10 p-4 bg-black/50 rounded-br-lg">
        <h1 className="text-2xl font-bold">UNO Mini App</h1>
        <div>Players: {playerList.map((p) => p.name).join(", ")}</div>
        <div>Current turn: {players.get(currentTurn)?.name || "none"}</div>
        <div>Your cards: {hand.length}</div>
        {isMyTurn && <div className="text-green-400 font-bold">YOUR TURN!</div>}
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Table3D />
      </div>

      {/* Hand Cards */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 flex-wrap p-2">
        {hand.map((card) => (
          <button
            key={card.id}
            onClick={() => isMyTurn && playCard(card.id)}
            disabled={!isMyTurn}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg ${
              !isMyTurn && "opacity-50 cursor-not-allowed"
            }`}
          >
            {card.color ? `${card.color} ${card.value}` : `WILD ${card.value}`}
          </button>
        ))}
        <button
          onClick={() => isMyTurn && drawCard()}
          disabled={!isMyTurn}
          className={`bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow-lg ${
            !isMyTurn && "opacity-50 cursor-not-allowed"
          }`}
        >
          Draw Card
        </button>
      </div>
    </div>
  );
}

export default App;
