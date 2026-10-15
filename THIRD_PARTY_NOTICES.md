# 第三方组件与源码

## CheerpJ 4.3

Java runtime powered by **CheerpJ**, © Leaning Technologies.

- 官网：https://cheerpj.com/
- 文档：https://cheerpj.com/docs/
- 许可说明：https://cheerpj.com/docs/licensing
- 运行时入口：https://cjrtnc.leaningtech.com/4.3/loader.js

运行时从其官方 CDN 加载，没有重新分发或自托管 CheerpJ。个人教育学习项目使用 Community License；页面保留相应署名。商业或机构使用应以厂商当时的适用条款为准。

## OpenJDK javac / BellSoft Liberica JDK 8u482-b10

本项目的 `compiler/tools.jar` 来自已安装的 BellSoft Liberica OpenJDK 8u482-b10，未修改二进制内容。Java 版本信息为 `openjdk version "1.8.0_482"`、`OpenJDK Runtime Environment (build 1.8.0_482-b10)`。本项目没有分发 Oracle JDK 的 JavaFiddle 示例工具包。

- 产品与下载：https://bell-sw.com/pages/downloads/
- 对应发行版本：https://github.com/bell-sw/Liberica/releases/tag/8u482%2B10
- OpenJDK：https://openjdk.org/
- 许可：GNU General Public License version 2，适用部分附带 Classpath Exception。
- 完整随包许可证：`compiler/licenses/OpenJDK-LICENSE.txt`、`ASSEMBLY_EXCEPTION.txt`、`THIRD_PARTY_README.txt`。
- 源码：`compiler/openjdk-tools-sources.zip` 从该安装版 `src.zip` 提取编译器和工具相关包，保留源码原有版权声明；原始发行版的完整源码及构建资料由 BellSoft 下载页的 Source code 入口提供。

OpenJDK、Java、BellSoft、Liberica 等商标归其各自所有者。本项目不声称获得其背书。

## 其他

网页、桥接类与练习内容为本项目创建；未复制 JavaFiddle 应用源码。JavaFiddle 官方示例仅用于验证 javac 在 CheerpJ 中运行的技术方案：https://github.com/leaningtech/javafiddle 。
