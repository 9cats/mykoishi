export namespace UB {
  export type Map = {
    flag: number; // unknown
    id: number; // unknown
    label: string; // 地图译名
    name: string; // 地图名
    type: number; // 3 = ze
    lose: number; //失败总数
    win: number; //获胜总数
  };

  export type Client = {
    index: number;
    name: string;
    steam2: string;
    steam64: string;
    alive: boolean;
    team: number;
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
    map: {
      name: string;
      label: string;
    };
    nextmap: {
      name: string;
      label: string;
    };
    timeleft: number; // 剩余时间
    t_score: number;
    ct_score: number;
    clients: Client[];
  };

  export type EventBody =
    //在线人数统计
    | { event: "app/online"; data: { users: number } }
    //服务器初始化
    | {
        event: "server/init";
        data: {
          id: number;
          appid: number; //游戏名ID
          mode: number; // 游戏模式
          maxplayers: number;
          name: string;
          host: string;
          port: number;
          map: Map;
          nextmap: Map;
          timeleft: number; // 剩余时间
          t_score: number;
          ct_score: number;
          clients: Client[];
        };
      }
    // 玩家生成 (玩家复活)
    | {
        event: "server/client/spawn";
        data: { alive: true };
        client: number; //用户索引
        server: number; // 服务器ID
      }
    // 玩家死亡
    | {
        event: "server/client/death";
        data: { alive: false };
        client: number;
        server: number;
      }
    // 玩家组标改变
    | {
        event: "server/client/clantagchanged";
        data: Clan;
        client: number;
        server: number;
      }
    // 玩家队伍改变
    | {
        event: "server/client/team";
        data: { team: number }; // 0(游戏外) | 1(观察者) | 2(T) | 3(CT)
        client: number;
        server: number;
      }
    // 玩家改变用户名
    | {
        event: "server/client/changename";
        data: { name: string };
        client: number;
        server: number;
      }
    // 玩家连接
    | {
        event: "server/client/connected";
        data: UB.Client;
        client: number;
        server: number;
      }
    // 玩家断开连接
    | {
        event: "server/client/disconnect";
        data: { index: number };
        client: number;
        server: number;
      }
    // 玩家加载完毕
    | {
        event: "server/client/loaded";
        client: number;
        server: number;
      }
    // 玩家AFK
    | {
        event: "server/client/afk";
        client: number;
        server: number;
      }
    //玩家成为指挥
    | {
        event: "server/client/commander";
        data: { commander: boolean };
        client: number;
        server: number;
      }
    //回合开始
    | {
        event: "server/round_start";
        server: number;
      }
    //回合结束
    | {
        event: "server/round_end";
        data: {
          reason?: number;
          winner?: number;
          t_score: number;
          ct_score: number;
        };
        server: number;
      }
    //回合冻结结束
    | {
        event: "server/round_freeze_end";
        server: number;
      }
    //地图更换
    | {
        event: "server/nextmap/changed";
        data: { name: string };
        server: number;
      }
    //地图加载完成
    | {
        event: "server/nextmap/loaded";
        data: Map;
        server: number;
      }
    //剩余时间改变
    | {
        event: "server/timeleftchanged";
        data: { timeleft: number };
        server: number;
      }
    //地图结算
    | {
        event: "server/cs_win_panel_match";
        server: number;
      }
    //地图结束
    | { event: "server/map/end"; server: number }
    //地图开始
    | {
        event: "server/map/start";
        data: Map;
        server: number;
      }
    //地图加载完成
    | {
        event: "server/map/loaded";
        data: Map;
        server: number;
      }
    //地图预定添加
    | {
        event: "server/nominate/add";
        server: number;
        data: {
          flag: number;
          name: string;
          label: string;
          steam64: string;
          type: number;
        };
      }
    //地图预定移除
    | {
        event: "server/nominate/add";
        server: number;
        data: {
          flag: number;
          name: string;
          label: string;
          steam64: string;
          type: number;
        };
      };
}
