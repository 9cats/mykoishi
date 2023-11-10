import Gamedig, { SUPPORTED_GAMES } from "./gamedig";

export const isIPv4 = (address: string) =>  /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?$/.test(address);
export const isIPv6 = (address: string) =>  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,6}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,5}((:[0-9a-fA-F]{1,4}){1,3})|([0-9a-fA-F]{1,4}:){1,4}((:[0-9a-fA-F]{1,4}){1,4})|([0-9a-fA-F]{1,4}:){1,3}((:[0-9a-fA-F]{1,4}){1,5})|([0-9a-fA-F]{1,4}:){1,2}((:[0-9a-fA-F]{1,4}){1,6})|([0-9a-fA-F]{1,4}:){1,7}:|[0-9a-fA-F]{1,4}::)$/.test(address);
export const isDomain = (address: string) => /^([\w.-]+)(?::\d+)?$/.test(address);
export const parseGameType : (id: string) => Gamedig.Type = (id) => {
  if (!id) throw new Error("no game type input");
  id = id.toLowerCase();
  if(!SUPPORTED_GAMES.includes(id as any)) throw new Error("invalid id");
  return id as Gamedig.Type;
}
export const parseAddress :(address: string)=> {host: string, port?: number} = (address) => {
  if (!address) throw new Error("no input address");
  const host = address.split(":")[0];
  const port = parseInt(address.split(":")[1] || undefined) || undefined;
  if(!host) throw new Error("invalid address");
  if (!isDomain(host) && !isIPv4(host) && !isIPv6(host)) throw new Error("invalid host");
  if (port && (port < 0 || port > 65535)) throw new Error("invalid port");
  return { host, port };
}