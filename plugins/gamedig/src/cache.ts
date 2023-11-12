import Gamedig from "./gamedig";

interface Entry {
  value: Gamedig.QueryResult;
  timer?: NodeJS.Timeout;
}

class Cache {
  private store: Record<string, Entry> = Object.create(null);

  constructor(private config: Cache.Config) {}

  get(key: string) {
    return this.store[key];
  }

  set(key: string, value: Gamedig.QueryResult) {
    this.delete(key);
    this.store[key] = { value };
    if (this.config.maxAge)
      this.store[key].timer = setTimeout(
        () => this.delete(key),
        this.config.maxAge
      );
  }

  delete(key: string) {
    if (this.store[key]) {
      clearTimeout(this.store[key].timer);
      delete this.store[key];
    }
  }
}

namespace Cache {
  export interface Config {
    maxAge?: number;
  }
}

export function useCache(config: Cache.Config) {
  return new Cache(config); 
}

export default Cache;