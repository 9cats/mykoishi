import { Schema } from "koishi";

interface Config {
  ws: {
    ttl: number;
  };
}

const Config: Schema<Config> = Schema.object({
  ws: Schema.object({
    ttl: Schema.number().default(1000 * 30),
  }).default({ ttl: 1000 * 30 }),
});

export default Config;
