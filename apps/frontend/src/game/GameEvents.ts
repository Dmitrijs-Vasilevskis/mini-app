
import { getStateCallbacks, type Room } from '@colyseus/sdk';
import { useGameStore } from '../store/gameStore';
import type { CardDTO, Color } from "../types/game";
import { useEffectStore } from '../store/effectsStore';

export class GameEvents {
    static initialize(room: Room) {
        const store = useGameStore.getState();

        const $ = getStateCallbacks(room);
        const effects = useEffectStore.getState();

        // players listener
        $(room.state).players.onAdd((player: any) => {

            const updatePlayer = (updates: Partial<any>) => {
                const players = useGameStore.getState().players;

                store.setPlayers(
                    players.map((p) =>
                        p.id === player.id
                            ? { ...p, updates }
                            : p
                    )
                );
            };

            // initial players
            const existing = useGameStore.getState().players.filter((p) => p.id !== player.id);

            store.setPlayers([
                ...existing,
                {
                    id: player.id,
                    name: player.name,
                    handCount: player.hand.length,
                    isTurn: player.isTurn
                },
            ]);

            $(player).listen(
                "isTurn",
                (isTurn: boolean) => {
                    updatePlayer({ isTurn });

                    if (player.id === room.sessionId) {
                        const current = useGameStore.getState().localPlayer;

                        // sync local player state
                        if (!current) return;

                        store.setLocalPlayer({
                            ...current,
                            isTurn
                        });
                    }
                }
            );

            $(player).listen(
                "name",
                (name: string) => {
                    updatePlayer({ name })
                }
            );

            $(player).hand.onAdd((card: CardDTO) => {
                const players = useGameStore.getState().players;

                store.setPlayers(
                    players.map((p) =>
                        p.id === player.id
                            ? {
                                ...p,
                                handCount: p.handCount + 1
                            }
                            : p
                    )
                );

                // local player hand sync
                if (player.id === room.sessionId) {
                    const current = useGameStore.getState().localPlayer;

                    if (!current) return;

                    const exists = current.hand.some(
                        (c) => c.id === card.id
                    );

                    if (exists) return;

                    store.setLocalPlayer({
                        ...current,
                        hand: [
                            ...current.hand,
                            {
                                id: card.id,
                                color: card.color,
                                value: card.value,
                            },
                        ],
                        handCount: current.handCount + 1,
                    })
                }
            });

            $(player).hand.onRemove((card: CardDTO) => {
                const players = useGameStore.getState().players;

                store.setPlayers(
                    players.map((p) =>
                        p.id === player.id
                            ? {
                                ...p,
                                handCount: p.handCount - 1
                            }
                            : p
                    )
                );

                // local player hand sync
                if (player.id === room.sessionId) {
                    const current = useGameStore.getState().localPlayer;

                    if (!current) return;

                    store.setLocalPlayer({
                        ...current,
                        hand: current.hand.
                            filter((c) => c.id !== card.id),
                        handCount: current.handCount - 1,
                    })
                }
            });

            // local player init
            if (player.id === room.sessionId) {

                const initialHand = player.hand.map((card: CardDTO) => ({
                    id: card.id,
                    color: card.color,
                    value: card.value,
                }));

                store.setLocalPlayer({
                    id: player.id,
                    name: player.name,
                    hand: initialHand,
                    handCount: initialHand.length,
                    isTurn: player.isTurn,
                });
            }
        });

        $(room.state).players.onRemove((_player: any, key: string) => {
            store.setPlayers(
                useGameStore.
                    getState().
                    players.
                    filter((p) => p.id != key)
            );
        });

        $(room.state).discardPile.onAdd((card: CardDTO) => {
            store.setDiscardTop({
                id: card.id,
                color: card.color,
                value: card.value,
            });

            const label =
                `${card.color?.toUpperCase() ?? ""}
                ${card.value.toUpperCase()}
                `;

            switch (card.value) {
                case "skip":
                    effects.addEffect({
                        text: label,
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break;
                case "reverse":
                    effects.addEffect({
                        text: label,
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break;
                case "drawTwo":
                    effects.addEffect({
                        text: "+2",
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break;
                case "wildDrawFour":
                    effects.addEffect({
                        text: "+4",
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break
                case "wild":
                    effects.addEffect({
                        text: "WILD",
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break;
                default:
                    effects.addEffect({
                        text: label,
                        color: card.color ?? "white",
                        emphasis: "normal"
                    })
            }
        });

        $(room.state).listen(
            "currentTurn",
            (currentTurn: string) => {
                store.setCurrentTurn(
                    currentTurn
                );
            }
        );

        $(room.state).listen(
            "activeColor",
            (color: Color) => {
                store.setActiveColor(
                    color
                );
            }
        );

        room.onMessage("gameEnd", (data: { winnderId: string, winnerName: string }) => {
            store.setWinner({ id: data.winnderId, name: data.winnerName });

            effects.addEffect({
                text: `${data.winnerName} WINS!`,
                color: "#facc15",
                emphasis: "special",
            })
        });
    }
}