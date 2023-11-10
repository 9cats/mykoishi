# koishi-plugin-gamedig

## 使用

### 指令：gamedig

语法：`gamedig [-t <游戏类型>] 服务器地址`

其中支持的`游戏类型`可参考 [GAMES_LIST](https://github.com/gamedig/node-gamedig/blob/master/GAMES_LIST.md#Supported)

> 使用样例: `gamedig -t minecraft mc.hypixel.net`

### 快捷键

#### 开启全部游戏的指令快捷键

1.打开`gamedig`插件配置页面，开启 `shortcut.enableALL` 并保存配置

2.输入 `<游戏类型> 服务器地址` 即可查询

> 使用样例: `minecraft mc.hypixel.net`

#### 设置自定义快捷键

1.打开`gamedig`插件配置页面，在 `shortcut.enableList` 中添加项目

2.`shortcut`填写触发的快捷键，`type`选择游戏类型，`arg`填写额外参数(可以为空，或者填写服务器地址)，`show`选择需要显示的信息

3.保存配置
