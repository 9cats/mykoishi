const MoeUBDictionary = {
  Server: {
    Mode: {
      0: { text: "全模式" },
      1: { text: "僵尸逃跑", emoji: "🧟‍♂️" },
      2: { text: "迷你游戏", emoji: "⚽" },
      3: { text: "越狱搞基", emoji: "🧱" },
      4: { text: "攀岩竞速", emoji: "🧗" },
      5: { text: "女装混战", emoji: "🔫" },
    },
  },
  Ban: {
    TimeType: { "1": { text: "劳改" }, "2": { text: "期限" } },
    Type: {
      ban: { timeType: 2, mode: 0, text: "封禁玩家" },
      gag: { timeType: 1, mode: 0, text: "文字聊天" },
      mute: { timeType: 1, mode: 0, text: "语音聊天" },
      spray: { timeType: 1, mode: 0, text: "使用喷漆" },
      balance: { timeType: 1, mode: 0, text: "货币奖励" },
      nominate: { timeType: 1, mode: 0, text: "预定地图" },
      guard: { timeType: 1, mode: 3, text: "申请狱警" },
      warden: { timeType: 1, mode: 3, text: "申请狱长" },
      item: { timeType: 1, mode: 1, text: "拾取神器" },
      commander: { timeType: 1, mode: 1, text: "自荐指挥" },
      button: { timeType: 1, mode: 0, text: "使用按钮" },
      experience: { timeType: 1, mode: 0, text: "经验奖励" },
      chat: { timeType: 1, mode: 0, text: "全服聊天" },
      daye: { timeType: 1, mode: 0, text: "大爷认证" },
      skin: { timeType: 1, mode: 0, text: "更换皮肤" },
      skin_body: { timeType: 1, mode: 0, text: "更换组件" },
    },
    Status: { "1": { text: "已解封" }, "2": { text: "封禁中" } },
  },
  Map: {
    Difficulty: {
      1: { text: "简单|T1" },
      2: { text: "普通|T2" },
      3: { text: "困难|T3" },
      4: { text: "高难|T4" },
      5: { text: "极难|T5" },
      6: { text: "T6" },
      7: { text: "T7" },
    },
    Tag: {
      1: { text: "跳刀" },
      2: { text: "闯关" },
      3: { text: "娱乐" },
      4: { text: "长征" },
      5: { text: "弹幕" },
      6: { text: "滑翔" },
      7: { text: "新手" },
      8: { text: "高手" },
      9: { text: "经典" },
      10: { text: "冷门" },
      11: { text: "人质" },
      12: { text: "爆破" },
    },
  },
} as const;

export const MapTagDictionary = MoeUBDictionary.Map.Tag;
export const MapDifficultyDictionary = MoeUBDictionary.Map.Difficulty;
export const ServerModeDictionary = MoeUBDictionary.Server.Mode;
