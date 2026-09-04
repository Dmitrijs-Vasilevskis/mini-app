import type { AvatarId } from "@uno/shared";
import { useEffectStore } from "../../../../store/effectsStore";
import { updatePlayerState, type BasePlayerUpdate } from "../../helpers/UnoPlayerStore";
import type { GameRoom, PlayerSchema, StateCallbacks } from "../../types";

export function BasePlayerListeners(
    room: GameRoom,
    player: PlayerSchema,
    $: StateCallbacks
) {
    let wasConnected = player.isConnected;

    const update = (updates: BasePlayerUpdate) => {
        updatePlayerState(
            room.sessionId,
            player.id,
            updates
        );
    };

    $(player).listen(
        "isTurn",
        (isTurn: boolean) => {
            update({ isTurn });
        }
    );

    $(player).listen(
        "name",
        (name: string) => {
            update({ name });
        }
    );

    $(player).listen(
        "score",
        (score: number) => {
            update({ score });
        }
    );

    $(player).listen(
        "isReady",
        (isReady: boolean) => {
            update({ isReady });
        }
    );

    $(player).listen(
        "isConnected",
        (isConnected: boolean) => {
            const reconnected = !wasConnected && isConnected;
            wasConnected = isConnected;

            update({ isConnected });

            if (reconnected) {
                useEffectStore.getState().addEffect({
                    text: `${player.name} went back!`,
                    color: "#facc15",
                    emphasis: "special",
                });
            }
        }
    );

    $(player).listen("avatarId", (avatarId: AvatarId) => {
        update({ avatarId });
    })
}