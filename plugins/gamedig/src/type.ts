import Gamedig from "./gamedig";
import { InfoKeys } from "./constants";

type InfoKey = typeof InfoKeys[number]

export type Shortcut = {
  shortcut: string;
  type: Gamedig.Type;
  arg?: string;
  show: InfoKey[];
}