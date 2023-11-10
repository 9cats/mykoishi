import Gamedig from "./gamedig";
import { InfoKeys } from "./constants";

type InfoKey = typeof InfoKeys[number]

export type Shortcut = {
  shortcut: string;
  type: Gamedig.Type;
  arg?: string;
  show: InfoKey[];
  // hidenPref?: Hidden[]
  // show
}

// const enum Intents {
//   "header" = 1 << 0,
//   "type" = 1 << 1,
//   "name" = 1 << 2,
//   "map" = 1 << 3,
//   "playernum" = 1 << 4,
//   "playerlist" = 1 << 5,
//   "ping" = 1 << 6,
//   "connect" = 1 << 7,
// }


// type Hidden = "header" | "type" | "name" | "map" | "playernum" | "playerlist" | "ping" | "connect"

// export const 
// & ShortcutPref

// export type ShortcutPref = {
//   "hide-header"?: boolean;
//   "hide-type"?: boolean;
//   "hide-name"?: boolean;
//   "hide-map"?: boolean;
//   "hide-playernum"?: boolean;
//   "hide-playerlist"?: boolean;
//   "hide-ping"?: boolean;
//   "hide-connect"?: boolean;
// };