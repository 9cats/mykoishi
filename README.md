# 9cats-koishi

Koishi 插件仓库

## 插件列表

| Plugin                                  | Description              | Version                                                                                                                               |
| --------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [gamedig](./plugins/gamedig/README.md)  | 查询游戏服务器状态        | [![npm](https://img.shields.io/npm/v/koishi-plugin-gamedig)](https://www.npmjs.com/package/koishi-plugin-gamedig)                     |

## 如何开发

```bash
yarn create koishi # 初始化工作区
git clone https://github.com/9cats/mykoishi.git external/9cats # 克隆仓库
# 在 /tsconfig.json 的 `.paths["koishi-plugin-*"]` 添加 `external/9cats/plugins/*/src`
yarn # 重新安装依赖
```
