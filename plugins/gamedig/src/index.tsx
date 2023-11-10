import { Context } from "koishi";
import {} from "koishi-plugin-puppeteer";
import Service from "./service";
import Config from "./config";
import { Shortcut } from "./type";
import { parseAddress, parseGameType } from "./utils";
import { SUPPORTED_GAMES } from "./gamedig";
import { InfoKeys } from "./constants";

declare module "koishi" {
  interface Context {
    gamedig: Service;
  }
}

export const name = "gamedig";
export const usage = `用法：gamedig [-t <游戏类型>] [-d] 服务器地址`;
export { default as Config } from "./config";
export function apply(ctx: Context, config: Config) {
  ctx.plugin(Service, config);
  ctx.inject(["gamedig"], (ctx) => {
    const logger = ctx.gamedig._logger;

    // register command
    const cmd = ctx
      .command("gamedig <address>", "查询游戏服务器状态")
      .option("debug", "-d, --debug 查看调试信息")
      .option("type", "-t, --type <type> 选择游戏名")
      .option("hide-header", "--hide-header 隐藏消息头")
      .option("hide-type", "--hide-type 隐藏游戏类型")
      .option("hide-name", "--hide-name 隐藏服务器名称")
      .option("hide-map", "--hide-map 隐藏地图名称")
      .option("hide-playernum", "--hide-playernum 隐藏玩家数量")
      .option("hide-playerlist", "--hide-playerlist 隐藏玩家数量")
      .option("hide-ping", "--hide-ping 隐藏延迟")
      .option("hide-connect", "--hide-connect 隐藏链接")
      .usage(usage)
      .action(async ({ options, session }, address) => {
        if (Object.keys(options).length === 0) return usage;
        const isDebug = options.debug;
        let debugMsg = `command options : ${JSON.stringify(options)}\n`;

        try {
          const type = parseGameType(options.type);
          debugMsg += `game type paresed result : ${type}\n`;
          const { host, port } = parseAddress(address);
          debugMsg += `server address paresed result : ${JSON.stringify({
            host,
            port,
          })}\n`;

          const result = await ctx.gamedig.query({
            type,
            host,
            port,
          });

          debugMsg += `query result : ${JSON.stringify(result)}\n`;
          isDebug && session.send(debugMsg);

          let value = "";
          if (!options["hide-header"]) value += `服务器信息：\n`;
          if (!options["hide-type"]) value += `类型：${type}\n`;
          if (!options["hide-name"]) value += `名称：${result.name}\n`;
          if (!options["hide-map"]) value += `地图：${result.map}\n`;
          if (!options["hide-playernum"])
            value += `人数：${result.players.length}/${result.maxplayers}\n`;
          if (!options["hide-playerlist"])
            value += `玩家：${result.players.map((p) => p.name).join(",")}\n`;
          if (!options["hide-ping"]) value += `延迟：${result.ping}\n`;
          if (!options["hide-connect"]) value += `链接：${result.connect}\n`;
          return value;
        } catch (e) {
          if (!isDebug) return `查询错误：请加 -d 显示详细的调试信息`;
          debugMsg += `error : ${e.message}\n`;
          return debugMsg;
        }
      });

    // ------- register shortcut --------
    const shortcutMapping: Record<string, Shortcut> = {};
    if (config.shortcut.enableAll) {
      SUPPORTED_GAMES.forEach((v) => {
        shortcutMapping[v] = {
          shortcut: v,
          type: v,
          show: [],
        };
      });
    }

    config.shortcut.enableList.forEach((v) => {
      shortcutMapping[v.shortcut] = v;
    });

    Object.values(shortcutMapping).forEach((v) => {
      const { shortcut, type, arg } = v;
      let extraArg = `$1 ${arg}`;
      InfoKeys.forEach(
        (key) => !v.show.includes(key) && (extraArg += ` --hide-${key}`)
      );

      cmd.shortcut(new RegExp(`^${shortcut}(.*)$`, "i"), {
        args: [extraArg],
        options: { type },
      });
    });
  });
}
