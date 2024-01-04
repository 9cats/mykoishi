import WebSocket from "ws";
import { Context } from "koishi";
import {} from "@koishijs/plugin-server";
import { QQBot } from "@koishijs/plugin-adapter-qq";
import Config from "./config";
import { EventEmitter } from "events";
import { UB } from "./type";
import { promises as fs } from "node:fs";
import { trimMarkdownGrammar } from "./utils";

export const name = "moeub-query-qq";
export const usage = `TODO: usage`;
export const inject = ["server"];

export function apply(ctx: Context, config: Config) {
  const http = ctx.http;
  const mapping = new Map<number, UB.Server>();
  const emitter = new EventEmitter();
  const logger = ctx.logger(name);
  const eventQueue: UB.EventBody[] = [];

  let ws = createConnection(config.ws.ttl);
  ctx.on("dispose", ws.close);

  // ----- 注册地图预览图片代理路由 -----
  ctx.server["get"]("/moeub/csgo-map-images/images/:imageName", async (ctx) => {
    const imageName = ctx.params.imageName.replaceAll("|UDL|", "_");
    const thirdPartyUrl = `https://mapimg.moeub.cn/csgo-map-images/images/${imageName}`;

    try {
      const response = await http.axios(thirdPartyUrl, {
        responseType: "arraybuffer",
      });
      ctx.status = response.status;
      ctx.set("Content-Type", response.headers["content-type"]);
      ctx.body = response.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 400)
      ) {
        ctx.status = 200;
        ctx.set("Content-Type", "image/webp");
        ctx.body = await fs.readFile(__dirname + "/../assets/default.jpg");
      } else {
        ctx.status = 500;
        ctx.body = "Error fetching image";
      }
    }
  });

  // ----- 注册事件监听 -----
  (function registerListener() {
    ws.on("open", () => {
      logger.info("MOEUB WebSocket connected.");
    });
    ws.on("message", (buffer: Buffer) => {
      const data = JSON.parse(buffer.toString());
      eventQueue.push(data);
      emitter.emit(data.event, data);
    });
    ws.on("error", (err: Error) => {
      logger.error(
        "MOEUB WebSocket encountered error: ",
        err.message,
        "Closing socket"
      );
    });
    ws.on("close", (code: number, reason: string) => {
      logger.error(
        `MOEUB WebSocket is closed witch code ${code}. Reconnect will be attempted in 5 second.`,
        reason.toString()
      );
      setTimeout(() => {
        logger.info("MOEUB WebSocket reconnecting...");
        mapping.clear();
        ws = createConnection(config.ws.ttl);
        registerListener();
      }, 5000);
    });
  })();

  // ----- 注册事件处理 -----
  function handlerEvent(body: UB.EventBody) {
    switch (body.event) {
      //服务器初始化
      case "server/init": {
        const server = body.data;
        mapping.set(server.id, server);
        break;
      }
      // 玩家改变用户名
      case "server/client/changename": {
        const { client, server } = body;
        const serverInfo = mapping.get(server);
        if (!serverInfo)
          return logger.warn(
            `handelEvent: server/client/changename: server ${server} not found`
          );
        const { clients } = serverInfo;
        const target = clients.find((item) => item.index == client);
        if (!target)
          return logger.warn(
            `handelEvent: server/client/changename: client ${client} not found`
          );
        target.name = body.data.name;
        break;
      }
      // 玩家连接
      case "server/client/connected": {
        // handlerEvent("server/client/disconnect")
        const { server } = body;
        const serverInfo = mapping.get(server);
        if (!serverInfo)
          return logger.warn(
            `handelEvent: server/client/connected: server ${server} not found`
          );
        const { clients } = serverInfo;
        clients.push(body.data);
        break;
      }
      // 玩家断线
      case "server/client/disconnect": {
        const { client, server } = body;
        const serverInfo = mapping.get(server);
        if (!serverInfo)
          return logger.warn(
            `handelEvent: server/client/disconnect: server ${server} not found`
          );
        const { clients } = serverInfo;
        const target = clients.find((item) => item.index == client);
        if (!target)
          return logger.warn(
            `handelEvent: server/client/disconnect: client ${client} not found`
          );
        // serverInfo.clients = clients.splice(clients.indexOf(target), 1);
        clients.splice(clients.indexOf(target), 1);
        break;
      }
      // 更换地图
      case "server/map/start": {
        const { server } = body;
        const serverInfo = mapping.get(server);
        if (!serverInfo)
          return logger.warn(
            `handelEvent: server/map/start: server ${server} not found`
          );
        serverInfo.nextmap = body.data;
        break;
      }
      // 地图加载
      case "server/map/loaded": {
        const { server } = body;
        const serverInfo = mapping.get(server);
        if (!serverInfo)
          return logger.warn(
            `handelEvent: server/map/start: server ${server} not found`
          );
        serverInfo.nextmap = body.data;
        break;
      }
      // 回合结算
      case "server/round_end": {
        const { server } = body;
        const { t_score, ct_score } = body.data;
        const serverInfo = mapping.get(server);
        if (!serverInfo)
          return logger.warn(
            `handelEvent: server/map/start: server ${server} not found`
          );
        serverInfo.t_score = t_score;
        serverInfo.ct_score = ct_score;
        break;
      }
      // 地图时间更改
      case "server/timeleftchanged": {
        const { server } = body;
        const serverInfo = mapping.get(server);
        if (!serverInfo)
          return logger.warn(
            `handelEvent: server/timeleftchanged: server ${server} not found`
          );
        serverInfo.timeleft = body.data.timeleft;
        break;
      }
      default: {
        // logger.warn(`Unknown event: ${data.event}`);
      }
    }
  }

  // ----- 处理时间队列 -----
  let isHandling = false;
  ctx.setInterval(() => {
    if (isHandling) return;
    if (eventQueue.length === 0) return;
    isHandling = true;
    while (eventQueue.length) handlerEvent(eventQueue.shift());
    isHandling = false;
  }, 100);

  const command = ctx
    .command("moeub [args:text]", "查询UB社区CS服务器状态")
    .option("menu", "-m 显示菜单")
    .alias("状态")
    .action(async ({ session, options }, args) => {
      if (session.platform !== "qq") return;
      const { guildId, channelId, messageId, timestamp } = session;
      const bot = session.bot as unknown as QQBot;
      const http = bot.groupHttp;
      if (options.menu) {
        await http.post(`/v2/groups/${guildId}/messages`, {
          msg_id: messageId,
          msg_type: 2,
          // msg_seq: 2,
          timestamp: timestamp,
          content: "",
          markdown: {
            custom_template_id: "102071733_1703268196",
            params: [
              {
                key: "title",
                values: ["UB服务器查询机器人"],
              },
              {
                key: "content",
                values: ["点击以下按键查询服务器状态"],
              },
            ],
          },
          keyboard: {
            id: "102071733_1703235586",
          },
        });
        return;
      }

      // 所有服务器
      const servers = Array.from(mapping.values()).sort((a, b) => a.id - b.id);
      let query: UB.Server[] = [];
      let serverType = "";
      let serverID = "";

      if (!args) query = servers.filter((server) => server.clients.length > 0);
      else {
        const regex =
          /^(僵尸逃跑|休闲对抗|休闲混战|攀岩竞速|叛乱越狱|饰品检视)/g;
        const match = regex.exec(args.trim());
        if (!match) return "未找到该服务器";
        serverType = match[1];
        serverID = args.trim().slice(match[1].length).trim();
        query = servers
          .filter((server) => {
            const name = server.name
              .replace("越狱搞基", "叛乱越狱")
              .replace("女装混战", "休闲混战");
            const match = /#[0-9]* /.exec(name);
            if (!match) return false;
            const id = parseInt(match[0].slice(1, -1)).toString();
            if (serverID === "") return name.includes(serverType);
            return name.includes(serverType) && id === serverID;
          });
      }

      // 多查询
      if (serverID === "") {
        const content = query
          .map((server) => {
            const name =
              server.name
                .split("UB社区 ")[1]
                .split(" Q群")[0]
                .split(" GOKZ")[0]
                .split(" 皮肤贴纸手套")[0] ?? "";
            const map =
              server.map.name.replaceAll("_", " ̱ ") +
              (server.map.label
                ? `(${trimMarkdownGrammar(server.map.label)})`
                : "");
            const playernum = `${server.clients.length
              .toString()
              .padStart(2, "0")}/${server.maxplayers
              .toString()
              .padStart(2, "0")}`;
            return `${name}(${playernum}) 地图：${map}`;
          })
          .join("\r\u200B");
        const params = {
          msg_id: messageId,
          msg_type: 2,
          // msg_seq: 2,
          timestamp: timestamp,
          content: "",
          markdown: {
            custom_template_id: "102071733_1703268196",
            params: [
              {
                key: "title",
                values: [`${serverType}服务器列表`],
              },
              {
                key: "content",
                values: [content],
              },
            ],
          },
          keyboard: {
            id: "102071733_1703235586",
          },
        };

        try {
          const result = await http.post(
            `/v2/groups/${guildId}/messages`,
            params
          );
          if (!result.ret) return;
          session.send(`发送失败，错误码：${result.ret}`);
        } catch (e) {
          if (e.response && e.response.data) {
            logger.error(e.response.data);
            return e.response.data;
          }
        }
        return;
      }
      // 单查询
      const result = query[0] || null;
      if (!result) return "未找到该服务器";
      const {
        name,
        host,
        port,
        map,
        nextmap,
        timeleft,
        t_score,
        ct_score,
        clients,
        maxplayers,
      } = result;

      const previewRequestURL = `${
        ctx.server.config.selfUrl
      }/moeub/csgo-map-images/images/${map.name.replaceAll("_", "|UDL|")}.jpg`;
      const timeleftStr =
        Date.now() >= timeleft * 1e3
          ? "即将更换"
          : `${Math.ceil((timeleft * 1e3 - Date.now()) / 1e3 / 60)} 分钟`;

      const params = {
        msg_id: messageId,
        msg_type: 2,
        // msg_seq: 2,
        timestamp: timestamp,
        content: "",
        markdown: {
          custom_template_id: "102071733_1703237487",
          params: [
            {
              key: "preview",
              values: [previewRequestURL],
            },
            {
              key: "name",
              values: [name.split(" Q群")[0]],
            },
            {
              key: "playernum",
              values: [`${clients.length} / ${maxplayers}`],
            },
            {
              key: "map",
              values: [map.name.replaceAll("_", " ̱ ")], // [U+0331] TODO:更多的md语法替换
            },
            {
              key: "mapchiname",
              values: [trimMarkdownGrammar(map.label ?? "") + " "],
            },
            {
              key: "score",
              values: [`${t_score} / ${ct_score}`],
            },
            {
              key: "timeleft",
              values: [timeleftStr],
            },
            {
              key: "playerlist",
              values: [
                clients
                  .map((client) => trimMarkdownGrammar(client.name))
                  .join("，") + " ",
              ],
            },
          ],
        },
        keyboard: {
          id: "102071733_1703235586",
        },
      };

      try {
        const result = await http.post(
          `/v2/groups/${guildId}/messages`,
          params
        );
        if (!result.ret) return;
        if (result.ret === 10000) {
          params.markdown.params.find(
            ({ key }) => key === "playerlist"
          ).values[0] = "【玩家名存在敏感词】";
          await http.post(`/v2/groups/${guildId}/messages`, params);
        } else {
          session.send(`发送失败，错误码：${result.ret}`);
        }
      } catch (e) {
        if (e.response && e.response.data) {
          logger.error(e.response.data);
          return e.response.data;
        }
      }
    });

  command.shortcut(new RegExp(`^(/|)菜单`, "i"), { args: ["-m"] });
  command.shortcut(new RegExp(`^(/|)状态(.*)$`, "i"), { args: ["$2"] });
  command.shortcut(
    new RegExp(
      `^(/|)(僵尸逃跑|休闲对抗|休闲混战|攀岩竞速|叛乱越狱|饰品检视)(.*)$`,
      "i"
    ),
    { args: ["$2", "$3"] }
  );
}

function createConnection(ttl: number) {
  const emitter = new EventEmitter();
  const ws = new WebSocket("wss://ws.moeub.cn/ws?files=0&appid=730");
  const maxHeatbeat = Math.ceil(ttl / 1000);
  let heatbeat = maxHeatbeat;

  const timer = setInterval(() => {
    if (--heatbeat >= 0) return;
    clearInterval(timer);
    emitter.emit("timeout");
    ws.close();
  }, 1000);

  ws.on("open", () => {
    emitter.emit("open");
  });
  ws.on("message", (buffer: Buffer) => {
    heatbeat = maxHeatbeat;
    emitter.emit("message", buffer);
  });
  ws.on("error", (err) => {
    emitter.emit("error", err);
  });
  ws.on("close", (code, reason) => {
    emitter.emit("close", code, reason);
  });

  return {
    on: emitter.on.bind(emitter),
    close: () => {
      emitter.removeAllListeners();
      ws.close();
    },
  };
}
