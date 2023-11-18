import { Context, Service, Schema, Logger } from "koishi";
import Cache, { useCache } from "./cache";
import Gamedig from "./gamedig";

class GameDigService extends Service {
  dataDir: string;
  _logger: Logger;
  cache?: Cache;

  constructor(ctx: Context, private config: GameDigService.Config) {
    super(ctx, "gamedig", false);
    this.dataDir = ctx.root.baseDir + "/data/gamedig";
    this._logger = ctx.logger("gamedig");
    if (config.cache.enabled) this.cache = useCache(config.cache);
  }

  async query(options: GameDigService.QueryOptions) {
    if (!this.cache) return await Gamedig.query(options);

    const cacheKey = `${options.type}|${options.host}:${options.port}`;
    const cache = this.cache.get(cacheKey);
    if (cache) return cache.value;
    if (options.forceUseCache) throw new Error(`cache not found`);
    const result = await Gamedig.query(options);
    this.cache.set(cacheKey, result);
    return result;
  }
}

namespace GameDigService {
  export interface Config {
    cache: {
      enabled?: boolean;
      maxAge?: number;
    };
  }

  export const Config: Schema<Config> = Schema.object({
    cache: Schema.object({
      enabled: Schema.boolean().required(),
      maxAge: Schema.number(),
    }),
  });

  export interface QueryOptions extends Gamedig.QueryOptions {
    forceUseCache?: boolean;
  }
}

export default GameDigService;
