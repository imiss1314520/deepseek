# dsh-greet-plugin

一个最小的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件（组合包 / bundle）：向 Harness 注册一个 `greet` 工具。

纯 JavaScript，**没有构建步骤**——可以直接从 git 地址安装，使用者不需要为构建脚本做任何授权。

## 安装

```sh
# 从 git 安装（换成你自己的用户名与仓库名）
dsh plugin --profile myprofile add github:<用户名>/<仓库名>

# 或者从本地 checkout 安装
dsh plugin --profile myprofile add ./dsh-greet-plugin
```

安装后先只验证配置层，再启动：

```sh
dsh --profile myprofile --dump-config   # 输出里应出现 "# == dsh-greet-plugin" 这一层
dsh --profile myprofile
```

## 使用

在会话里输入：

```
Use the greet tool to greet Ada.
```

模型会调用 `greet`，并收到工具结果 `Hello, Ada!`。

## 它由什么组成

`package.json` 里的 `dsh.bundle.patch` 声明了本包贡献的配置层；`cordis.patch.yml` 向组合中插入一行插件，按**包名**引用本包（不是源码路径），这样 Node 才能解析到已安装的代码；`index.js` 导出 `name`、`inject`、`apply`，在 `apply` 中通过 `defineTool` 注册工具。

| 文件 | 作用 |
|---|---|
| `package.json` | 声明 `dsh.bundle.patch`，以及运行时依赖 |
| `cordis.patch.yml` | 本包贡献的配置层：插入插件行 |
| `index.js` | 插件入口：注册 `greet` 工具 |

`inject = ['tools']` 让 Cordis 等工具注册表就绪后再调用 `apply`。`defineTool` 依据 `parameters` 校验参数，`execute` 返回 `output.schema` 声明的规范值，`output.render` 再把它转成面向模型的内容。

## 改成你自己的插件

1. 改 `package.json` 的 `name`，例如 `dsh-my-plugin`。**这个包名才是别人安装和引用时用的名字，与仓库名无关。**
2. 改 `cordis.patch.yml` 中插件行的 `name`，必须与上面的包名完全一致。
3. 改 `index.js` 的 `name` 导出、工具名、参数与返回值。
4. 需要用户可配置的项时，导出一个 Schemastery schema 作为 `Config`，并把默认值写在 schema 里。

## 注意事项

- **不要引入构建步骤。** `dsh plugin add github:...` 拉取的是源码而不是构建产物：包若需要 `build`，使用者安装会失败，还得在 profile 的 `pnpm-workspace.yaml` 中写 `allowBuilds` 授权——那等于允许你的代码在安装时于他机器上执行，多数人不愿意。保持纯 JavaScript 就没有这个问题。
- 运行时依赖写进 `dependencies`；别人通过 git 或 npm 安装时，pnpm 会自动装上它们。
- 工具 API 的完整参考见官方文档 `docs/user/develop/basic/tool.zh.md`；插件配置见 `docs/user/develop/basic/config.zh.md`。

## 发布与发现

- 发布到 npm：`pnpm publish`，安装的是预构建产物，使用者无需授权构建。
- 让别人找到这个插件：给 GitHub 仓库加上 `dsh-plugin` 话题（<https://github.com/topics/dsh-plugin>）。

## License

MIT