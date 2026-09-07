import type { BasePlayerDTO } from "../../../store/types";
import type { PlayerSchema } from "../types";

export function mapPlayer(player: PlayerSchema): BasePlayerDTO {
    return {
        id: player.id,
        name: player.name,
        isTurn: player.isTurn,
        isConnected: player.isConnected,
        isReady: player.isReady,
        score: player.score,
        photoUrl: player.photoUrl,
        avatarId: player.avatarId,
        seatIndex: player.seatIndex,
        gameData: player.gameData,
    };
}