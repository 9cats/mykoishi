# 9cats-koishi

Koishi 插件仓库

## 插件列表

| Plugin                                  | Description              | Version                                                                                                                               |
| --------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [gamedig](./plugins/gamedig/README.md)  | 查询游戏服务器状态        | [![npm](https://img.shields.io/npm/v/koishi-plugin-gamedig)](https://www.npmjs.com/package/koishi-plugin-gamedig) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2F9cats%2Fmykoishi.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2F9cats%2Fmykoishi?ref=badge_shield)
                    |

## 如何开发

```bash
yarn create koishi # 初始化工作区
git clone https://github.com/9cats/mykoishi.git external/9cats # 克隆仓库
# 在 /tsconfig.json 的 `.paths["koishi-plugin-*"]` 添加 `external/9cats/plugins/*/src`
yarn # 重新安装依赖
```


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2F9cats%2Fmykoishi.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2F9cats%2Fmykoishi?ref=badge_large)