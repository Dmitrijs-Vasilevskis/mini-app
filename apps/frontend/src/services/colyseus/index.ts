import { BlackjackService } from "./BlackjackService";
import { ColyseusService } from "./ColyseusService";
import { RoomService } from "./RoomService";
import { UnoService } from "./UnoService";

export const colyseusService = new ColyseusService();

export const roomService = new RoomService(colyseusService);
export const unoService = new UnoService(colyseusService);
export const bjService = new BlackjackService(colyseusService);