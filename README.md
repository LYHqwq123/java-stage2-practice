# Java 阶段练习工作台

面向大学基础 Java 课程的静态练习网站。题目与参考答案位于 `data/questions.json`；打开页面后可读题、写代码、查看零基础讲解、核对答案、输入 Scanner 数据，获取真正的编译和运行结果。

## 使用

1. 从题目列表选择一题，独立编写代码。
2. 把题目所需数据填入“标准输入”，点击“编译并运行”或按 Ctrl+Enter。
3. 对照“零基础详解”理解步骤；“参考答案”默认收起，可以载入并修改。
4. 点击“检查样例”执行题库样例，或手动标记已学会。

代码草稿、输入和进度只保存在当前浏览器的 localStorage，清理站点数据会清除这些内容。可随时下载当前 `.java` 文件。样例通过不代表涵盖所有边界情况。

## 本地预览

这是零构建静态项目，无需 npm 安装。安装 Node.js 后在项目目录执行：

```sh
node serve.cjs
```

在浏览器打开 `http://127.0.0.1:8080/`。随包服务器支持 CheerpJ 读取 JAR 必须的 HTTP Range 请求；Python 自带的普通 http.server 不支持这一要求。请使用 HTTP 或 HTTPS；直接双击 `index.html` 无法读取题库和启动 Java 环境。

## GitHub Pages 部署

将本目录作为独立仓库根目录推送到 GitHub。在 Settings → Pages 选择“Deploy from a branch”，分支 `main`、目录 `/(root)`。`.nojekyll` 已包含，无需构建、后端、API 密钥或 Actions 工作流。所有本地资源均使用相对路径，支持 `https://用户名.github.io/仓库名/` 项目路径。

## 编译器如何工作

- 页面按需从 Leaning Technologies CDN 加载 CheerpJ 4.3，启动真实的 Java 8 JVM。
- `compiler/tools.jar` 是 BellSoft Liberica OpenJDK 8u482-b10 的原始工具包。`PracticeBridge.java` 调用其中的 `com.sun.tools.javac.Main.compile`，把当前源代码真正编译成 `.class` 字节码。
- 编译通过后，用新的 URLClassLoader 加载用户类，再调用 `main`。每次独立目录、独立类加载器，因此各题中的同名 `Main`、`Student` 等不会串用旧代码。
- 标准输入采用 UTF-8；标准输出、标准错误、javac 诊断和 Java 异常分别捕获并呈现，绝不使用写死输出或 JavaScript 模拟解释器。
- 代码与输入留在浏览器运行，不提交远端编译服务。网站及运行库文件仍需要联网下载，首次启动较慢；CDN 不可用会明确显示错误，可以点击“停止”并重试。
- 用户程序限时约 6 秒，输出限 256 KB；前端还会在环境加载超过 180 秒或单次调用超过 90 秒时提示。点击“停止”销毁运行环境。适用于本题库控制台练习；不提供本机文件、原生库和系统进程访问。

## 文件

- `index.html`、`assets/`：中文响应式界面，键盘操作与本地草稿。
- `runner.html`：独立 iframe 内的 CheerpJ JVM。
- `compiler/PracticeBridge.java`：桥接源码；`practice-bridge.jar` 是 Java 8 字节码。
- `compiler/tools.jar`：真正的 javac 编译器。
- `compiler/openjdk-tools-sources.zip`、`compiler/licenses/`：工具源码与许可证。
- `downloads/`：本阶段答案和零基础详解 PDF。

重建桥接 JAR（需要本机 JDK）：

```sh
javac --release 8 -encoding UTF-8 -d build compiler/PracticeBridge.java
jar cf compiler/practice-bridge.jar -C build .
```

运行环境、编译器来源和许可证见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
