import { Schema } from "koishi";
import { Shortcut } from "./type";
import { SUPPORTED_GAMES } from "./gamedig";

interface Config {
  cache: {
    enabled?: boolean;
    maxAge?: number;
  };

  shortcut: {
    enableAll?: boolean;
    enableList?: Shortcut[];
  };
}

const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    cache: Schema.intersect([
      Schema.object({
        enabled: Schema.boolean().default(false).description("是否开启查询缓存"),
      }),
      Schema.union([
        Schema.object({
          enabled: Schema.const(true).required(),
          maxAge: Schema.number().default(5000).description("查询缓存过期时间"),
        }),
        Schema.object({}),
      ]),
    ]),
  }).description("缓存配置"),

  // shortcut
  Schema.object({
    shortcut: Schema.object({
      enableAll: Schema.boolean().default(false).description("使能所有快捷键"),
      enableList: Schema.array(
        Schema.object({
          shortcut: Schema.string().required().description("快捷键"),
          type: Schema.union(SUPPORTED_GAMES)
            .required()
            .description("游戏类型"),
          arg: Schema.string().default("").description("查询参数"),
          show: Schema.array(Schema.union([
            Schema.const("header").description("消息头"),
            Schema.const("type").description("游戏类型"),
            Schema.const("name").description("服务器名称"),
            Schema.const("map").description("地图"),
            Schema.const("playernum").description("玩家数量"),
            Schema.const("playerlist").description("玩家列表"),
            Schema.const("ping").description("延迟"),
            Schema.const("connect").description("连接地址"),
          ]))
            .default(["name"])
            .role("checkbox"),
        })
      )
        .default([])
        .description("使能的快捷键列表"),
    }),
  }).description("快捷键配置"),
]);

export default Config;
