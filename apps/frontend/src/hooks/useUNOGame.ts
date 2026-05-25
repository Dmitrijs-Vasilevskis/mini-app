// import { useEffect } from "react";
// import { useGameStore } from "../store/gameStore";
// import { colyseusService } from "../services/colyseus";
// import { GameEvents } from "../game/GameEvents";

// export function useUNOGame(username: string) {
//     const setConnected = useGameStore((s) => s.setConnected);

//     useEffect(() => {
//         let mounted = true;

//         async function init() {
//             const room = await colyseusService.connect(username);

//             if (!mounted) return;

//             setConnected(true);

//             GameEvents.initialize(room);
//         }

//         init();

//         return () => {
//             mounted = false;
//             colyseusService.leave();
//         }
//     }, [username]);
// }