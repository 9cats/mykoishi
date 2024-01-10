import { MapTagDictionary } from "./constants";

export namespace MoeUB {
  export type UnloadedMap = {
    name: string; // 地图名
    label: string; // 地图译名
  };
  export type Map = UnloadedMap & {
    id: number; // 地图ID
    flag: number; // 标签
    mode: number; // 模式
    type: number; // 难度
    lose: number; //失败总数
    win: number; //获胜总数
  };

  // export type Map = {
  //   id: number;
  //   flag: number; // 标签 (tags)
  //   label?: string; // 地图译名
  //   name: string; // 地图名
  //   mode?: number; // 模式
  //   type: number; // 难度
  //   lose: number; //失败总数
  //   win: number; //获胜总数
  // };

  export type Client = {
    index: number;
    name: string;
    steam2: string;
    steam64: string;
    alive: boolean;
    team: Team;
    clan?: Clan; //组
    commander?: boolean;
  };

  export type Clan = {
    id: string;
    name: string;
    tag: string;
  };

  export type Server = {
    id: number;
    appid: number; //游戏名ID
    mode: number; // 游戏模式
    maxplayers: number;
    name: string;
    host: string;
    port: number;
    map: Map | UnloadedMap;
    nextmap?: Map | UnloadedMap;
    timeleft: number; // 剩余时间
    ct_score: number;
    t_score: number;
    files: string[];
    workshops: string[];
    clients: Client[];
    online: boolean;
    level?: MapLevel;
    numrounds?: number;
    maxrounds?: number;
    nominate?: MapNominate[];
  };

  export type MapLevel = {
    num?: number; // 当前关卡
    max?: number; // 最多关卡
    name?: string; // 关卡名
  };

  export type MapNominate = {
    flag: number; // ?
    label: string;
    name: string;
    steam64: string;
    type: number; // ?
  };

  export type EventBody =
    /* ----- APP Event ----- */
    | {
        event: "app/online"; //在线人数统计
        data: { users: number };
      }

    /* ----- Init Event ----- */
    | {
        event: "server/init"; //服务器初始化
        data: Server;
      }

    /* ----- Client Event ----- */
    | {
        event: "server/client/connected"; // 玩家连接
        data: Client;
        client: number;
        server: number;
      }
    | {
        event: "server/client/disconnect"; // 玩家断开连接
        data: { index: number };
        client: number;
        server: number;
      }
    | {
        event: "server/client/changename"; // 玩家改变用户名
        data: { name: string };
        client: number;
        server: number;
      }
    | {
        event: "server/client/team"; // 玩家队伍改变
        data: { team: Team };
        client: number;
        server: number;
      }
    | {
        event: "server/client/spawn"; // 玩家生成 (玩家复活)
        data: { alive: true };
        client: number;
        server: number;
      }
    | {
        event: "server/client/death"; // 玩家死亡
        data: { alive: false };
        client: number;
        server: number;
      }
    | {
        event: "server/client/commander"; //玩家成为指挥
        data: { commander: boolean };
        client: number;
        server: number;
      }
    | {
        event: "server/client/warden"; //玩家成为狱长
        data: { warden: boolean };
        client: number;
        server: number;
      }
    | {
        event: "server/client/afk"; // 玩家AFK
        client: number;
        server: number;
      }
    | {
        event: "server/client/loaded"; // 玩家加载完毕
        client: number;
        server: number;
      }
    // | {
    //     event: "server/client/titlechanged"; //玩家 title 改变？
    //     data: any;
    //     client: number;
    //     server: number;
    //   }
    | {
        event: "server/client/clantagchanged"; // 玩家组标改变
        data: Clan;
        client: number;
        server: number;
      }

    /* ----- Map Event ----- */
    | {
        event: "server/map/start"; //地图开始
        data: UnloadedMap;
        server: number;
      }
    | {
        event: "server/map/loaded"; //地图加载完成
        data: Map;
        server: number;
      }
    // | {
    //     event: "server/map/end"; //地图结束
    //     server: number;
    //   }

    /* ----- NextMap Event ----- */
    | {
        event: "server/nextmap/changed"; //地图更换
        data: UnloadedMap;
        server: number;
      }
    | {
        event: "server/nextmap/loaded"; //地图加载完成
        data: Map;
        server: number;
      }

    /* ----- Nominate Event ----- */
    | {
        event: "server/nominate/add"; //地图预定添加
        server: number;
        data: {
          flag: number;
          name: string;
          label: string;
          steam64: string;
          type: number;
        };
      }
    | {
        event: "server/nominate/remove"; //地图预定移除
        server: number;
        data: {
          flag: number;
          name: string;
          label: string;
          steam64: string;
          type: number;
        };
      }
    /* ----- Other Event ----- */
    | {
        event: "server/round_start"; //回合开始
        server: number;
        data: {
          maxrounds: number;
          numrounds: number;
        };
      }
    | {
        event: "server/round_end"; //回合结束
        data: {
          reason?: number;
          winner?: number;
          t_score: number;
          ct_score: number;
        };
        server: number;
      }
    | {
        event: "server/timeleftchanged"; //剩余时间改变
        data: { timeleft: number };
        server: number;
      }
    | {
        event: "server/levelchange"; //关卡改变
        server: number;
        data: {
          num: number;
          max: number;
          name: string;
        };
      }
    | {
        event: "server/round_freeze_end"; //回合冻结结束
        server: number;
      };
  // | {
  //     event: "server/cs_win_panel_match"; //地图结算
  //     server: number;
  //   };

  export enum Team {
    UNLOADED = 0,
    OBSERVER,
    T,
    CT,
  }

  export type EventMap = {
    [K in EventBody as K["event"]]: K;
  };
}