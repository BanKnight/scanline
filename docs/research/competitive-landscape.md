# Scanline 竞品格局调研(Competitive Landscape)

> 调研日期:2026-11-08。信息以 2025–2026 年为准。
> 方法:WebSearch + 官方页面/仓库抓取(优先一手来源)。存疑处标「待核实」。
> 范围:8 个在售竞品(Ghostty、Warp 2.0、WezTerm、iTerm2、Tabby、Wave、WindTerm、Termius);Alacritty/kitty 仅作架构参照。

---

## TL;DR

- **市场分三层**:① 极简原生高性能层(Ghostty、Alacritty/kitty、WezTerm)——快、开源、无 AI;② AI-first 层(Warp、Wave、Termius 部分)——AI 强但普遍绑定云/订阅,或依赖 Electron(Wave);③ SSH 运维工具层(Termius、WindTerm、Tabby)——远程管理强,但闭源订阅或 Electron/部分开源。
- **没有竞品同时做到**:GPU 原生性能 + 全平台(含 Windows)+ MIT 开源 + 内置 AI(BYOK/本地优先)+ 免订阅。这是事实性组合缺口(见「机会缺口」)。
- **传统终端痛点集中在**:Windows 支持断层、发布停滞逼用户用 nightly、Wayland 质量、基础功能(滚动回看搜索/滚动条)缺失多年、Electron 内存、协议兼容碎片化。
- **AI 终端痛点集中在**:订阅疲劳(Warp 2025-10 砍免费额度、Termius $10/月)、隐私/云绑定(闭源+强制登录的历史包袱)、幻觉命令与不可信执行、商业模式反复(Warp 一年内三次定价变动后开源客户端)。
- **2025–2026 两大标志性事件**:Ghostty 于 2026-04-28 宣布离开 GitHub 自托管;Warp 于同月(2026-04-28)将客户端开源(AGPL,待核实范围)。开源与可自托管成为显性用户诉求。

---

## 一、用户痛点汇总(本文最重要章节)

> 每条:描述 → 常见于哪些竞品 → 证据链接。
> (a)=传统终端痛点;(b)=AI 终端痛点。

### P1 (a) Windows 支持断层或二等公民
**描述**:macOS 优先的产品普遍不提供官方 Windows 版,或 Windows 版姗姗来迟且质量问题多。Ghostty 官方明确不再做官方 Windows 构建(留给第三方基于 libghostty 开发);Warp 直到 2025-02-26 才 Windows GA 且早期有 GPU 渲染毛刺报告;iTerm2 仅 macOS;WindTerm macOS 侧只有 Intel 构建需 Rosetta(待核实)。Windows 是最大单点用户群流失处。
**常见**:Ghostty、iTerm2、Warp(迟到)、WindTerm(macOS 侧反例)。
**证据**:
- https://github.com/ghostty-org/ghostty/discussions/12290 (官方 Q&A:不做官方 Windows 构建)
- https://github.com/ghostty-org/ghostty/discussions/12371 (改为支持第三方 libghostty 终端)
- https://www.warp.dev/blog/launching-warp-on-windows (2025-02 才 GA)

### P2 (a) 发布停滞,稳定版落后,用户被迫用 nightly
**描述**:WezTerm 最近一次稳定版停留在 2024-02(20240203),Wayland 等修复只进 nightly,社区出现「Future of WezTerm」担忧帖;WindTerm 2.7.0(2025-03)后至 2026-11 无新稳定版,被用户评「development has stagnated」;Tabby 出现「新版有问题、一直回滚」的讨论。单人维护加剧此风险。
**常见**:WezTerm(最严重)、WindTerm、Tabby。
**证据**:
- https://www.reddit.com/r/wezterm/comments/1sl6ink/future_of_wezterm
- https://github.com/wezterm/wezterm/issues/6633 (稳定版 Wayland/GNOME 平铺不可用)
- https://github.com/Eugeny/tabby/discussions/10918 ("Tabby is best but I roll back all the time",2026-01)

### P3 (a) Wayland/Linux 桌面集成质量差
**描述**:大量用户(尤其 Fedora/GNOME 41+)报告 WezTerm 稳定版在 Wayland 下输入延迟、分屏平铺不可用;Ghostty 被批评 macOS-first、Linux 为二等公民;WezTerm 官方 FAQ 承认 Wayland 支持不如 X11。
**常见**:WezTerm、Ghostty(Linux 侧感知)、kitty/Alacritty 相对较好(对照)。
**证据**:
- https://github.com/wezterm/wezterm/issues/6633 (GNOME Wayland tiling 不可用,2025-02)
- https://news.ycombinator.com/item?id=42712738 (Ghostty 1.0 HN 讨论中的 macOS-first 批评)

### P4 (a) 基础功能长期缺失(滚动回看搜索、原生滚动条等)
**描述**:滚动回看搜索(scrollback search)是终端最基础的功能之一,Ghostty 直到 2026-03 的 1.3.0 才补上,且官方称之为「most-requested」;原生滚动条同样 1.3 才加入。说明即便新一代「明星」终端,基础体验也需多年补课。
**常见**:Ghostty;WezTerm 此项较好(对照);多数竞品具备。
**证据**:
- https://ghostty.org/docs/install/release-notes/1-3-0 (1.3.0,2026-03-09:scrollback search、原生滚动条、可点击链接)

### P5 (a) Electron 应用内存/性能负担
**描述**:Tabby 官方 README 自述「not lightweight — 在意内存请用 ConEmu 或 Alacritty」;Wave 在 HN 被批「表面华丽、底层管理糟糕」;有开发者专门把 Warp fork 成「no login, no AI, no telemetry」的本地版。轻量原生渲染是可量化的差异化点。
**常见**:Tabby、Wave(均为 Electron);Warp(Rust 但被嫌重)。
**证据**:
- https://github.com/Eugeny/tabby (README "What Tabby is and isn't")
- https://news.ycombinator.com/item?id=38869559 (Wave HN 讨论)
- https://www.reddit.com/r/warpdotdev/comments/1v58iv2/ ("I forked Warp into a local-first terminal")

### P6 (a) 单人维护/总线因子风险
**描述**:WezTerm(Wez Furlong)与 WindTerm(单人作者)均为事实上的单人项目,发布停滞与响应慢直接源于此;r/wezterm 社区公开讨论项目未来。用户选型时把「项目会不会死」当作真实顾虑。
**常见**:WezTerm、WindTerm;Ghostty/Warp 有全职资源(对照)。
**证据**:
- https://www.reddit.com/r/wezterm/comments/1sl6ink/future_of_wezterm
- https://github.com/kingToolbox/WindTerm/discussions/42 (维护者承认处理慢、需要更多资源)

### P7 (a) 终端协议兼容碎片化(图片协议、kitty keyboard protocol)
**描述**:图片协议三分天下:iTerm2 imgcat、Sixel、kitty graphics,各终端支持不一(WezTerm 支持 imgcat/Sixel;Ghostty 支持 kitty graphics;Tabby/WindTerm/Termius 基本不支持)。kitty keyboard protocol 虽被主流终端实现,但需要应用主动 opt-in,用户常遇到「装了却不生效」(如 Vim 在 Ghostty 下默认检测不到,需手动配置)。
**常见**:全部 8 家(程度不同)。
**证据**:
- https://github.com/vim/vim/issues/16318 (Ghostty 下 Vim 不自动启用 kitty keyboard protocol)
- https://blessed.readthedocs.io/en/1.23/keyboard_kitty.html (各终端协议支持矩阵)
- https://wezterm.org (WezTerm 官方特性页:支持 iTerm2 imgcat 协议)

### P8 (a) SSH 经代理/跳板的延迟与 tmux 性能
**描述**:WindTerm 用户报告经 SOCKS5 代理/跳板的 SSH 会话明显延迟;iTerm2 用户长期抱怨 tmux 集成模式下性能下降。远程工作流是 SSH 工具用户的核心场景,延迟问题直接劝退。
**常见**:WindTerm、iTerm2。
**证据**:
- https://github.com/kingToolbox/WindTerm/discussions/42
- https://dev.to/laggardkernel/comment/f3jm (iTerm2 tmux 性能下降)
- https://gitlab.com/gnachman/iterm2/-/issues/10671 (Low Power Mode 禁用 Metal 渲染)

### P9 (b) 订阅疲劳与免费额度缩水
**描述**:Warp 于 2025-10-07 把免费档 AI 请求从更高额度砍到每月 75 次(首两月 150),2025-10-30 改制为 Build $20/月(1500 credits),HN 专门开帖讨论;Termius Pro $10/月(年付)且同步/多设备属付费功能,免费档约 10 个主机;用户明确表达想要买断制或免费开源替代品。
**常见**:Warp、Termius;Wave(BYOK+免费)是反向对照。
**证据**:
- https://news.ycombinator.com/item?id=45772558 (Warp Terminal changes pricing model,2025-10-31)
- https://www.reddit.com/r/warpdotdev/comments/1p9d3rv/warps_recent_changes_feel_rushed_confusing_and ("Warp's Recent Changes Feel Rushed, Confusing, and Anti-User")
- https://www.reddit.com/r/homelab/comments/1m3c019/termius_pro_price ("Termius Pro price")

### P10 (b) 隐私担忧:闭源 + 云 AI + 账号体系
**描述**:r/commandline 对 Warp 的典型表态:「宁可要一个臃肿的 Electron 终端,也不要一个需要登录的闭源 Rust AI 终端」;Termius 用户不愿私钥经第三方云同步;iTerm2 3.6 的 AI Chat 能读终端内容并代执行命令,安全社区提醒权限过宽的数据外发风险。BYOK/本地存储成为信任对冲方案(Wave、iTerm2)。
**常见**:Warp、Termius;iTerm2 AI(需配置把关)。
**证据**:
- https://www.reddit.com/r/commandline/comments/1izj5cv/ ("Thoughts on Warp?")
- https://www.reddit.com/r/selfhosted/comments/135iugx/termius_and_their_dark_ways
- https://medium.com/@apier/iterm2-version-3-6-7f71330b796a (AI Chat 可读终端并代跑命令的风险提示)

### P11 (b) 幻觉命令与不可信的 agent 执行
**描述**:行业层面,编码 agent 会「幻觉」终端输出、谎报测试通过(而非真实执行);「slopsquatting」攻击者预注册 agent 幻觉出的包名投毒;学术研究(arXiv 2025-09)系统分析编码 agent 的安全/隐私可利用面。终端作为 agent 执行面,缺乏成熟的审批/回放/沙箱范式:Wave 的「命令执行(带审批)」到 v0.12 仍是 coming soon,iTerm2 AI Chat 代执行需逐次授权。
**常见**:Warp、Wave、iTerm2、Termius(所有带执行能力的 AI 终端)。
**证据**:
- https://surgehq.ai/blog/when-coding-agents-spiral-into-693-lines-of-hallucinations (2025-09)
- https://arxiv.org/html/2509.24240v1 (编码 agent 安全分析)
- https://github.com/wavetermdev/waveterm (README:Command execution with approval = coming soon)

### P12 (b) 供应商锁定与云绑定
**描述**:Warp 的协作(Warp Drive)、对话存储、cloud agents 均在其云端,免费档限制明显;Termius 的核心价值(跨设备同步)绑定其账号与 Pro 订阅,迁移成本高。用户反复以「no account, no subscription, no telemetry」为理由迁移到开源替代品。
**常见**:Warp、Termius;Ghostty/WezTerm/Tabby(无云依赖)为对照。
**证据**:
- https://www.warp.dev/pricing (Free 档对 cloud agents/Warp Drive/对话存储的限制)
- https://termius.com/pricing (同步为 Pro 起)
- https://www.reddit.com/r/homelab/comments/1m3c019/termius_pro_price

### P13 (b) 商业模式反复变动引发信任危机
**描述**:Warp 一年内经历:强制登录(2024-11 才取消)→ 2025-06 Warp 2.0 转型「Agentic Development Environment」→ 2025-10 免费额度缩减 → 2025-10-30 Build 改制 → 2026-04-28 客户端开源(AGPL,待核实范围)但 AI 服务仍闭源。HN 评论:「一个有伟大产品宣言、极好 UI 的公司,被贪婪、闭源、不听用户毁掉」。定价与开源策略的反复本身成为用户流失原因。
**常见**:Warp(最典型);Termius(自动更新改手动等策略变更)。
**证据**:
- https://news.ycombinator.com/item?id=47936264 ("Warp is now open-source" HN 讨论,2026-04)
- https://news.ycombinator.com/item?id=45772558
- https://docs.termius.com/changelog (近期:移除自动更新、改为手动触发)

### P14 (a) 配置体验两极:文件配置陡峭 vs GUI 配置臃肿
**描述**:WezTerm/Ghostty/Alacritty 走配置文件路线(强大但学习曲线陡),Tabby/iTerm2 走 GUI 设置(易上手但面板巨大、难以版本化管理);WezTerm 的 Lua API 强大但被部分用户视为门槛。两类范式都各有一批不满者,缺少「文件优先 + 图形辅助」的统一体验(此条为体验综述,证据为社区讨论基调)。
**常见**:WezTerm、Ghostty(陡峭);Tabby、iTerm2(GUI 臃肿)。
**证据**:
- https://www.reddit.com/r/wezterm/comments/1sl6ink/future_of_wezterm (讨论配置/维护门槛)
- https://wezterm.org (Lua 配置 API 面)

### P15 (a) 版本质量波动与回归
**描述**:Tabby 2025 年出现插件搜索/下载失效(#10640、#10467)与高严重级安全公告(GHSA-prcj-7rvc-26h4,2025-01;ZMODEM 自动确认问题 2025-05 修复);Ghostty 1.2.x 连发多个补丁版修死锁/标签栏问题;Warp Windows 早期渲染毛刺(待核实,无一手链接)。快速迭代与回归控制难以兼得。
**常见**:Tabby、Ghostty(补丁密集)、Warp。
**证据**:
- https://github.com/Eugeny/tabby/issues/10640
- https://github.com/Eugeny/tabby/discussions/10918
- https://ghostty.org/docs/install/release-notes/1-2-0 (及 1.2.1–1.2.3 补丁说明)

---

## 二、竞品逐个分析

### 2.1 Ghostty

| 维度 | 事实 |
|---|---|
| 平台 | macOS(SwiftUI 原生)、Linux(GTK)。**无官方 Windows GUI 构建**(官方表示不再计划,转而支持第三方基于 libghostty 的终端;`libghostty-vt` 库本身兼容 Windows/WASM)。无 Web/SSH 形态。[repo](https://github.com/ghostty-org/ghostty)、[discussions #12290](https://github.com/ghostty-org/ghostty/discussions/12290)、[#12371](https://github.com/ghostty-org/ghostty/discussions/12371) |
| 开源/许可/技术 | 开源,MIT(仓库许可证标识);主体 Zig;渲染:macOS Metal + CoreText,Linux OpenGL;多线程(独立读/写/渲染线程)+ SIMD 解析器。[repo README](https://github.com/ghostty-org/ghostty) |
| 核心特性 | 性能:与 Alacritty 同档,宣称比 iTerm2/Terminal.app 快约两个数量级(官方口径);UI:多窗口/标签/分屏,1.2 起支持 macOS 原生 titlebar 标签(含 OSC 9;4 进度显示)与 Linux/GTK 集成标签、可拖拽分屏分隔线、vi 式键盘选择;协议:kitty graphics/image protocol、synchronized rendering、经 xterm 审计的合规性;配置:纯文件配置,无 GUI(1.0 reflection 提到设置 GUI 为 macOS 原生的一部分,2026 逐步完善,待核实细节);远程:无内置 SSH 管理/协作;独有的可嵌入 `libghostty` C/Zig 库与本地崩溃报告(不自动上传)。[repo](https://github.com/ghostty-org/ghostty)、[1.2 release notes](https://ghostty.org/docs/install/release-notes/1-2-0) |
| AI 能力 | 无任何 AI 功能(官方无相关路线)。 |
| 定价 | 免费,无商业化。 |
| 用户抱怨 | 无 Windows 官方支持([#12290](https://github.com/ghostty-org/ghostty/discussions/12290)、[#437](https://github.com/ghostty-org/ghostty/issues/437));部分平台启动时间偏长(HN 用户报告 NixOS 上秒级启动,待核实样本);macOS-first 批评([HN 1.0 讨论](https://news.ycombinator.com/item?id=42712738));1.2.x 补丁密集(死锁、标签栏问题)。 |
| 2025–2026 动态 | 1.2.0(2025-09-15,unsafe paste 确认、集成标签、命令面板等)→ 1.2.1–1.2.3(2025-10);**1.3.0(2026-03-09):滚动回看搜索、原生滚动条、可点击链接、AppleScript**;1.3.1(2026-03-13);**1.4.0(2026-10-27):glass 风格原生标签栏等**([release notes](https://ghostty.org/docs/install/release-notes))。**2026-04-28 宣布离开 GitHub,迁至自托管基础设施**([mitchellh.com](https://mitchellh.com/writing/ghostty-leaving-github)、[r/commandline](https://www.reddit.com/r/commandline/comments/1sykf0w/ghostty_terminal_is_leaving_github))。 |

### 2.2 Warp(Warp 2.0)

| 维度 | 事实 |
|---|---|
| 平台 | macOS、Windows(GA 2025-02-26)、Linux;无 Web 版。云功能(登录后)跨端一致。[Windows 发布](https://www.warp.dev/blog/launching-warp-on-windows) |
| 开源/许可/技术 | **2026-04-28 客户端开源**(GitHub warpdotdev/warp),据报道客户端 AGPL、UI 框架 MIT(待核实具体范围);AI/云服务仍闭源。全 Rust 实现、GPU 渲染(官方口径)。[开源 HN 讨论](https://news.ycombinator.com/item?id=47936264)、[How Warp Works](https://www.warp.dev/blog/how-warp-works) |
| 核心特性 | 性能:Rust+GPU,自绘 UI;UI:Blocks(命令块)交互、现代自绘 UI、Workflows;配置:GUI 设置 + YAML/配置文件;协议:自有渲染栈,图片协议/kitty keyboard protocol 支持情况未见官方文档(待核实);远程/协作:Warp Drive(命令/工作流/笔记的云端共享)、团队协作、Cloud Agents(并行后台 agent)、agent 可响应 PR 评论。 |
| AI 能力 | AI-first:自然语言→命令、Agent Mode、多 agent 并行、代码库索引;模型接入:官方托管(OpenAI/Anthropic/z.ai 等)+ **Free 档支持 BYOK("Bring your own AI inference")**;深度云绑定(Warp Drive、对话存储、cloud agents);Enterprise 支持 BYOLLM/自托管 agent。[定价页](https://www.warp.dev/pricing) |
| 定价(2026-11 官方页) | Free $0(AI 走 PAYG,BYOK 可用);**Build $20/月(年付 $18/月,含 $20 用量)**;Max $200/月;Business $50/用户/月;Enterprise 定制;Warp Factories(托管 agent 运行环境)按用量另计。 |
| 用户抱怨 | 历史强制登录(2024-11 取消,[HN/官方博客](https://www.warp.dev/blog);r/commandline 反感帖 [1izj5cv](https://www.reddit.com/r/commandline/comments/1izj5cv/));2025-10 免费额度缩减与 Build 改制引发反弹([HN 45772558](https://news.ycombinator.com/item?id=45772558)、[Reddit 1p9d3rv](https://www.reddit.com/r/warpdotdev/comments/1p9d3rv/warps_recent_changes_feel_rushed_confusing_and));闭源+遥测催生社区 fork([1v58iv2](https://www.reddit.com/r/warpdotdev/comments/1v58iv2/));Windows 早期 GPU 渲染毛刺(2025-03 用户报告,待核实)。 |
| 2025–2026 动态 | 2025-06-24 **Warp 2.0「Agentic Development Environment」**;2025-10-07 免费档 AI 请求砍至 75/月;2025-10-30 推出 Build 单一付费档;2026-04-28 **客户端开源(AGPL,待核实)**;2026 年持续推出 agents 与 GitHub 集成(如 agent 响应代码评审评论)。 |

### 2.3 WezTerm

| 维度 | 事实 |
|---|---|
| 平台 | Linux、macOS、Windows 10、FreeBSD、NetBSD;内置 SSH 客户端与串口支持;自带 mux(本地/远程复用)。[官网](https://wezterm.org) |
| 开源/许可/技术 | 开源,MIT([LICENSE.md](https://raw.githubusercontent.com/wezterm/wezterm/main/LICENSE.md));Rust;GPU 加速渲染(配置项含 `front_end` 与 WebGPU 相关选项,官网配置文档)。 |
| 核心特性 | 性能:GPU 渲染,与主流快速终端同档(无官方基准);UI:标签/分屏/多窗口 + workspace;配置:**Lua 配置**(极强的 API:事件、键位、mux、插件);协议:超链接规则、iTerm2 imgcat 图片协议、Sixel(待核实版本)、kitty keyboard protocol(第三方协议矩阵确认);远程:内置 SSH + mux server(远程 pane 原生鼠标/回看);连字、emoji、true color、命令面板、Quick Select。 |
| AI 能力 | 无。 |
| 定价 | 免费开源(有赞助页)。 |
| 用户抱怨 | **稳定版停在 2024-02(20240203-110809-5046fc22)**,Wayland 修复只在 nightly([r/wezterm Future of WezTerm](https://www.reddit.com/r/wezterm/comments/1sl6ink/future_of_wezterm));GNOME Wayland 平铺不可用([#6633](https://github.com/wezterm/wezterm/issues/6633));Windows 稳定性([#2999](https://github.com/wezterm/wezterm/issues/2999) "What makes wezterm bad?");约 1400 个 open issue、单人维护担忧(社区讨论)。 |
| 2025–2026 动态 | 无新稳定版(截至 2026-11),依赖 nightly;无商业模式变化;社区持续讨论接手/贡献模式。 |

### 2.4 iTerm2

| 维度 | 事实 |
|---|---|
| 平台 | 仅 macOS(10.14+)。[官网](https://iterm2.com) |
| 开源/许可/技术 | 开源,GPLv2([官网](https://iterm2.com));Objective-C(GitHub gnachman/iTerm2);**Metal 渲染引擎**(3.2 引入,官方 news)。 |
| 核心特性 | 性能:Metal GPU 渲染,但非 GPU-first 架构;UI:分屏、热键窗口、标签、搜索、自动补全、触发器、shell integration、tmux 集成、Python API(可脚本化)、Profiles 体系([features](https://iterm2.com/features.html));协议:imgcat/iTerm2 图片协议发源、Sixel 支持(3.5 起,待核实);远程:tmux -CC 控制,无内置 SSH 管理。 |
| AI 能力 | 3.6(2025-09-16):**AI Chat**(内置 LLM 聊天,可读终端内容、跨会话链接上下文、经许可代执行命令)、在线模型数据库动态更新、多 provider 支持;3.7 系列:更深的 ChatGPT 集成、1Password 集成([官网 news](https://iterm2.com/news.html)、[downloads](https://iterm2.com/downloads.html));接入方式:用户自带 API key(OpenAI/Anthropic 等)+ ChatGPT 集成;无订阅。 |
| 定价 | 免费(接受捐赠)。 |
| 用户抱怨 | 仅 macOS(结构性);tmux 模式性能下降([dev.to 评论](https://dev.to/laggardkernel/comment/f3jm));Low Power Mode 强制禁用 Metal([GitLab #10671](https://gitlab.com/gnachman/iterm2/-/issues/10671));非 GPU-first 的架构复杂度拖累性能([HN 历史讨论](https://news.ycombinator.com/item?id=17634547))。 |
| 2025–2026 动态 | 3.6.0(2025-09-16)AI Chat 上线;3.7 系列滚动更新(导航/过滤/1Password/ChatGPT 深度集成);无商业模式变化。 |

### 2.5 Tabby

| 维度 | 事实 |
|---|---|
| 平台 | Windows、macOS、Linux(含 Windows portable);**SSH/SFTP/Telnet 客户端有 Web 版(可自托管)**;串口支持。[repo README](https://github.com/Eugeny/tabby) |
| 开源/许可/技术 | 开源,MIT(仓库);TypeScript + **Electron + xterm.js**(二手来源 [trmn.sh](https://www.trmn.sh/terminals/tabby),README 未自述);自述「not lightweight」。 |
| 核心特性 | 性能:Electron,xterm.js 渲染(官方自认不轻量);UI:嵌套分屏、多侧标签、Quake 全局热键窗、主题/配色、连字;配置:GUI 设置为主 + 可同步(config sync 插件到 Gist/Gitee);协议:Zmodem、括号粘贴、进度检测;VT220+扩展;远程:SSH 连接管理器、X11/端口转发、跳板、agent forwarding(含 Pageant/Windows OpenSSH Agent)、登录脚本、SFTP、加密 vault;插件生态(docker、workspace-manager、save-output 等)。 |
| AI 能力 | 无官方内置 AI;**官方插件体系中有 mcp-server 插件**(把 Tabby 作为 MCP server 暴露给 Cursor/Windsurf 等 AI 客户端,[README 插件列表](https://github.com/Eugeny/tabby)、[issue #11276](https://github.com/Eugeny/tabby/issues/11276));社区存在 AI 插件(待核实具体维护状态)。 |
| 定价 | 免费开源。 |
| 用户抱怨 | Electron 内存/卡顿(README 自认 + 多年社区批评);版本质量波动与回滚([#10918](https://github.com/Eugeny/tabby/discussions/10918));插件搜索/下载故障([#10640](https://github.com/Eugeny/tabby/issues/10640)、[#10467](https://github.com/Eugeny/tabby/issues/10467));2025-01 高严重级安全公告 GHSA-prcj-7rvc-26h4。 |
| 2025–2026 动态 | 持续滚动发版 + nightly;2025 年安全修复(ZMODEM 自动确认,2025-05);无重大商业/架构变化。 |

### 2.6 Wave

| 维度 | 事实 |
|---|---|
| 平台 | macOS 11+、Windows 10 1809+、Linux(glibc 2.28+),x64/arm64;`wsh` 助手甚至支持老内核 Linux。[repo README](https://github.com/wavetermdev/waveterm) |
| 开源/许可/技术 | 开源,**Apache-2.0**(README 确认);技术栈为 Electron(前端)+ Go(后端)(据构建文档/社区资料,待核实一手表述);HN 讨论确认其 Electron 形态。 |
| 核心特性 | 性能:Electron(非 GPU 原生);UI:拖放式 block 工作区(终端/编辑器/浏览器/AI 助手混排)、命令块、全屏切换;配置:GUI + 自定义主题/背景;协议:非传统图片协议路线,以自身富预览(md/图片/视频/PDF/CSV/目录)呈现;远程:**durable SSH(断线/重启后自动重连)**、内置图形编辑器编辑远程文件、`wsh` CLI(workspace 管理、本地↔远程文件同步)、本地秘密存储(系统后端)、一键远程连接。 |
| AI 能力 | **Wave AI(beta)**:读终端输出/回看做上下文、文件读写(带备份与用户审批)、`wsh ai` CLI 集成;**BYOK:OpenAI/Claude/Gemini/Azure/Perplexity + 本地 Ollama/LM Studio,免账号**;免费 beta credits;命令执行(带审批)标注 coming soon。v0.12(2026-04-16)为 AI 体验重设计版本(默认模型 GPT-5)。[release notes](https://docs.waveterm.dev/releasenotes)、[repo](https://github.com/wavetermdev/waveterm) |
| 定价 | 免费开源(GitHub Sponsors 赞助);AI 走用户自己的 key。 |
| 用户抱怨 | Electron 内存/观感大于实质([HN 38869559](https://news.ycombinator.com/item?id=38869559));2024-09 大重写(v0.8+)曾造成迁移断裂(legacy 版废弃,待核实用户流失程度)。 |
| 2025–2026 动态 | 2024-09 全量重写;2025–2026 持续迭代;2026-04-16 v0.12 Wave AI beta(重设计 + GPT-5);无商业化动作(仍赞助制)。 |

### 2.7 WindTerm

| 维度 | 事实 |
|---|---|
| 平台 | Windows、macOS、Linux(Homebrew 构建为 Intel-only 需 Rosetta,待核实);SSH/Telnet/串口/SFTP 形态。[repo](https://github.com/kingToolbox/WindTerm) |
| 开源/许可/技术 | **部分开源**:仅按计划「逐步开源」的组件(工具库/算法/GUI 控件/协议库)以 Apache-2.0 开放,核心闭源;二进制对商用/非商用完全免费。作者解释是防恶意植入/防盗代码([issue #2238](https://github.com/kingToolbox/WindTerm/issues/2238)、[#830](https://github.com/kingToolbox/WindTerm/issues/830));实现语言为 C/C++ 为主(仓库语言统计,待核实精确比例)。 |
| 核心特性 | 性能:原生实现,宣称内存压缩与高吞吐基准(官方口径,自比 PuTTY/xterm/iTerm2);UI:多主题、分屏、同步输入、命令面板、锁屏、多语言、Unicode 13;配置:GUI 会话管理/偏好(2.7 新增自动补全设置、ONEKEY);协议:SSH v2/Telnet/Raw TCP/Serial、X/Y/ZModem、端口/X11 转发、ProxyJump、tmux 集成(2.7);远程:SSH 管理器、SFTP/SCP + 本地文件管理器、自动登录(password/key/keyboard-interactive/gssapi)。 |
| AI 能力 | 无。 |
| 定价 | 免费(闭源二进制,免费商用)。 |
| 用户抱怨 | 不完全开源(#2238/#830);处理性能与资源占用([discussion #42](https://github.com/kingToolbox/WindTerm/discussions/42),维护者承认慢);**更新停滞:2.7.0(2025-03)后至 2026-11 无新稳定版**;经 SOCKS5 代理/跳板的 SSH 延迟(2025-07 用户反馈);连字致渲染问题(discussion #42 内提及)。 |
| 2025–2026 动态 | 2.7.0 Prerelease 2/3(2025-01/02)→ 2.7.0 正式版(约 2025-03,[releases](https://github.com/kingToolbox/WindTerm/releases)、[Chocolatey](https://community.chocolatey.org/packages/windterm));自称周期 2–3 个月,v2.8 在路线图(Mosh、Rlogin、FTP/FTPS、脚本/宏/插件系统);未见 2026 年新发布(截至 2026-11)。 |

### 2.8 Termius

| 维度 | 事实 |
|---|---|
| 平台 | macOS、Windows、Linux、iOS、Android 全端;核心卖点为跨端云同步。无 Web 终端(待核实)。[官网](https://termius.com) |
| 开源/许可/技术 | **闭源**免费增值产品;桌面端技术栈未公开文档化(待核实,社区普遍认为基于 Electron 类方案)。 |
| 核心特性 | 性能:非主打;UI:主机分组/标签、跨端一致 UI;配置:GUI + 云同步的 host/snippet/known_hosts/密钥管理;协议:SSH、SFTP、Telnet、**Mosh**、串口(Pro)、端口转发(免费)、SSH 证书/跳板/agent forwarding(Pro)、生物识别/PIN 锁;远程/协作:Team vault 共享、实时协作、共享会话日志(Team+);SAML SSO(Business+)。[定价页](https://termius.com/pricing) |
| AI 能力 | **AI 补全(免费档即含)**;2026 年转向 AI agent 叙事:官方博客「8 tips for using AI agents on mobile with Termius」(2026-05-11,agent 分析上传文件、手机作实时预览窗)、社交媒体推广「从 iPhone vibe coding」;接入方式:官方托管(细节待核实)。[定价页](https://termius.com/pricing)、[changelog](https://docs.termius.com/changelog) |
| 定价(2026-11 官方页) | Starter 免费(本地 vault、SSH/SFTP、AI 补全;用户报告免费档约 10 台主机上限);**Pro $10/月(年付)**:云 vault + 跨端同步、snippets、会话日志、串口、SSH 证书等;Team $20/席/月;Business $30/席/月;Enterprise 定制。 |
| 用户抱怨 | 订阅制与免费档限制([r/homelab "Termius Pro price"](https://www.reddit.com/r/homelab/comments/1m3c019/termius_pro_price));「暗黑操作」式订阅转化([r/selfhosted](https://www.reddit.com/r/selfhosted/comments/135iugx/termius_and_their_dark_ways));私钥经第三方云同步的安全顾虑(同上);2026 年把自动更新改为手动触发(changelog,部分用户困扰,待核实影响面)。 |
| 2025–2026 动态 | 持续滚动更新(changelog 活跃);2026 年主推移动端 AI agent 用法;未见被收购/重大商业化变动(截至 2026-11,待核实)。 |

### 参照(一句话,不展开)

- **Alacritty**:Rust + OpenGL 的极简 GPU 终端,无标签/分屏(靠 tmux 补),无 AI,MIT,常作为性能基准。
- **kitty**:C + GPU(OpenGL)终端,kitty graphics protocol 与 kitty keyboard protocol 的定义者;Scanline 的协议兼容目标主要指它。
- (两者均免费开源,佐证「性能参照系」与「协议事实标准」的来源:https://github.com/alacritty/alacritty 、https://sw.kovidgoyal.net/kitty/ )

---

## 三、特性矩阵对照表

> 图例:✅=有;⚠️=部分/受限/待核实;❌=无。
> 「协议」行指对非传统协议的支持面;「AI 云绑定」指默认路径对厂商云的依赖度。

| 特性 | Ghostty | Warp 2.0 | WezTerm | iTerm2 | Tabby | Wave | WindTerm | Termius |
|---|---|---|---|---|---|---|---|---|
| macOS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Windows | ❌(官方) | ✅(2025-02 GA) | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Linux | ✅(GTK) | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Web / 移动端 | ❌ | ❌ | ❌ | ❌ | ⚠️(SSH/SFTP/Telnet Web 版,可自托管) | ❌ | ❌ | ⚠️(iOS/Android 原生,无 Web) |
| 开源 | ✅ MIT | ⚠️(2026-04 客户端 AGPL,AI 服务闭源,待核实) | ✅ MIT | ✅ GPLv2 | ✅ MIT | ✅ Apache-2.0 | ⚠️(部分开源 Apache-2.0,核心闭源) | ❌ |
| 实现语言 | Zig | Rust | Rust | Objective-C | TS(Electron+xterm.js) | TS+Go(Electron,待核实) | C/C++(待核实比例) | 未公开(待核实) |
| GPU 渲染 | ✅ Metal/OpenGL | ✅(GPU) | ✅(OpenGL/WebGPU 前端) | ✅ Metal(非 GPU-first) | ❌(xterm.js/canvas) | ❌(Electron) | ⚠️(原生,非 GPU 主打) | ❌ |
| 标签/分屏 | ✅ | ✅(Blocks) | ✅ | ✅ | ✅ | ✅(Blocks 工作区) | ✅ | ✅ |
| 配置方式 | 文件 | GUI+配置 | Lua(极强) | GUI+Profiles+Python API | GUI+插件 | GUI+主题 | GUI | GUI+云同步 |
| 图片协议 | ✅ kitty graphics/image | ⚠️(待核实) | ✅ imgcat + Sixel(待核实版本) | ✅ imgcat 发源,Sixel ⚠️ | ❌ | ⚠️(自有富预览,非标准协议) | ❌ | ❌ |
| kitty keyboard protocol | ✅(需应用 opt-in) | ⚠️(待核实) | ✅ | ⚠️(协议矩阵列名,细节待核实) | ❌(待核实) | ❌(待核实) | ❌(待核实) | ❌(待核实) |
| OSC 扩展(如 9;4 进度) | ✅(1.2 原生标签进度) | ⚠️(待核实) | ✅ | ✅ | ⚠️(进度检测) | ⚠️ | ⚠️ | ❌(待核实) |
| 内置 SSH/串口/telnet | ❌(SSH 交由 shell) | ⚠️(非主打) | ✅ SSH+串口 | ⚠️(tmux -CC) | ✅ SSH/SFTP/Telnet/串口+Zmodem | ✅ durable SSH+编辑器 | ✅ SSH/Telnet/串口/SFTP/X-Y-ZModem | ✅ SSH/SFTP/Telnet/Mosh/串口(Pro) |
| mux/持久会话 | ❌ | ⚠️(cloud agents 非会话) | ✅(内置 mux) | ⚠️(tmux 集成) | ⚠️(记住标签) | ✅(durable SSH) | ⚠️ | ⚠️(Mosh) |
| 内置 AI | ❌ | ✅(Agent/多 agent/Drive) | ❌ | ✅(AI Chat 3.6+) | ⚠️(MCP server 插件,无内置 LLM) | ✅(Wave AI beta,BYOK+本地) | ❌ | ✅(AI 补全免费;2026 agent 方向) |
| BYOK / 本地模型 | — | ✅(Free 档 BYOK) | — | ✅(自带 API key) | —(插件自定) | ✅(含 Ollama/LM Studio) | — | ⚠️(官方托管为主,待核实) |
| AI 云绑定度 | — | 高(Drive/对话存储/cloud agents) | — | 低(key 自持) | — | 无账号(纯 BYOK) | — | 中(云 vault/同步绑定) |
| 协作/团队 | ❌ | ✅(Drive/共享) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅(Team vault,付费) |
| 定价 | 免费 | Free / Build $20 / Max $200 / Business $50·席 | 免费 | 免费(捐赠) | 免费 | 免费(赞助) | 免费(闭源二进制) | Starter 免费 / Pro $10 / Team $20·席 / Business $30·席 |
| 2025–26 关键动态 | 1.2(2025-09)→1.3(2026-03)→1.4(2026-10);离开 GitHub(2026-04) | Warp 2.0(2025-06);免费额度缩减(2025-10);Build 改制(2025-10);客户端开源(2026-04) | 无新稳定版;nightly 承载全部修复 | 3.6 AI Chat(2025-09);3.7 系列(1Password/ChatGPT) | 安全公告与修复(2025);MCP 插件生态 | v0.12 Wave AI beta(2026-04) | 2.7.0(2025-03)后停滞 | 手动更新策略;移动端 AI agent(2026-05) |

---

## 四、客观机会缺口清单(仅事实缺口,不做产品决策)

1. **组合缺口**:截至 2026-11,8 家竞品中无一同时具备:GPU 原生渲染 + 全平台(含官方 Windows)+ 宽松开源许可(MIT/Apache)+ 内置 AI(BYOK/本地优先、非订阅)。Ghostty 缺 Windows 与 AI;Warp 有 AI 有 Windows 但许可受限且云绑定深;WezTerm 全平台开源但无 AI 且发布停滞;Wave 有开源 AI BYOK 但 Electron。
2. **「自带模型、cloud-optional」无人占据**:所有带 AI 的竞品要么绑定自家云(Warp/Termius),要么 BYOK(Wave/iTerm2);没有任何终端随应用分发自带可运行的本地模型(Wave 仅是「能连」Ollama,不自带模型)。
3. **复古 CRT 美学无人作为产品定位**:8 家竞品的默认视觉均为现代扁平 UI;CRT 效果仅以主题/插件/shader 等边缘形式存在(Tabby 有 CRT 效果插件、kitty 有 shader 支持,均非产品定位)。以 CRT 美学为第一设计语言的在售竞品为零。
4. **Windows 原生体验空位**:Ghostty 放弃官方 Windows 构建(交给 libghostty 第三方);Warp Windows 2025 年才 GA;原生性能级 + 开源 + Windows 优先的终端在该组合中缺席(Windows Terminal 免费 but 微软官方、非 Rust/GPU-AI 叙事,不在 8 家之列)。
5. **AI 执行的信任基础设施缺位**:竞品的 agent 执行普遍是「逐次授权」或尚未上线(Wave 命令执行 coming soon;iTerm2 需逐次许可;Warp 有审批但闭环在其云);幻觉命令/不可信执行是行业级抱怨(slopsquatting、agent 谎报),市场尚无标准化的本地审批/回放/差异预览范式。
6. **定价模式空位**:现售 AI 终端为「订阅/credits」(Warp $20+、Termius $10+),开源终端为「免费无 AI」;买断制或「免费终端 + 纯 BYOK 无抽成」的 AI 形态在 8 家中不存在(Wave 接近但为 beta credits + 赞助制,非产品化定价)。
7. **发布健康度机会**:WezTerm 稳定版停留 2024-02、WindTerm 停留 2025-03,「活跃维护的全平台开源终端」这一基本承诺本身即是部分用户的选型痛点(r/wezterm「Future of」、r/networking「stagnated」)。
8. **协议兼容完整度机会**:kitty graphics + Sixel + imgcat + kitty keyboard protocol 四项全支持的竞品为零(Ghostty 缺 Sixel;WezTerm 缺 kitty graphics;Tabby/WindTerm/Termius 基本全缺,标注以官方文档为准);kitty keyboard protocol 的「应用未 opt-in 就不生效」体验问题普遍存在(vim#16318)。
9. **跨端同步的开源替代缺位**:Termius 的核心付费点(跨设备主机/密钥同步 + 团队 vault)在开源阵营没有直接对等物(Tabby 有插件级 config sync 到 Gist/Gitee,非产品化 vault)。事实层面存在「开源 + 自托管同步 + 免费」的组合空位。
10. **自托管/离线 AI 工作流**:Warp Enterprise 才有自托管 agent/BYOLLM;开源 + 本地模型 + 无账号的 AI 终端工作流仅 Wave 部分实现(Electron + beta),无原生高性能实现者。

---

## 附:主要一手来源索引

- Ghostty:https://github.com/ghostty-org/ghostty ・ https://ghostty.org/docs/install/release-notes/1-2-0 ・ https://ghostty.org/docs/install/release-notes/1-3-0 ・ https://mitchellh.com/writing/ghostty-leaving-github ・ https://mitchellh.com/writing/ghostty-1-0-reflection
- Warp:https://www.warp.dev/pricing ・ https://www.warp.dev/blog/launching-warp-on-windows ・ https://www.warp.dev/blog/how-warp-works ・ https://news.ycombinator.com/item?id=47936264 ・ https://news.ycombinator.com/item?id=45772558
- WezTerm:https://wezterm.org ・ https://raw.githubusercontent.com/wezterm/wezterm/main/LICENSE.md ・ https://github.com/wezterm/wezterm/issues/6633 ・ https://github.com/wezterm/wezterm/issues/2999
- iTerm2:https://iterm2.com ・ https://iterm2.com/news.html ・ https://iterm2.com/downloads.html ・ https://gitlab.com/gnachman/iterm2/-/issues/10671
- Tabby:https://github.com/Eugeny/tabby ・ https://tabby.sh ・ https://github.com/Eugeny/tabby/issues/10640 ・ https://github.com/Eugeny/tabby/discussions/10918
- Wave:https://github.com/wavetermdev/waveterm ・ https://docs.waveterm.dev/releasenotes ・ https://news.ycombinator.com/item?id=38869559
- WindTerm:https://github.com/kingToolbox/WindTerm ・ https://github.com/kingToolbox/WindTerm/releases ・ https://github.com/kingToolbox/WindTerm/issues/2238 ・ https://github.com/kingToolbox/WindTerm/discussions/42
- Termius:https://termius.com/pricing ・ https://docs.termius.com/changelog
- 协议参照:https://sw.kovidgoyal.net/kitty/keyboard-protocol ・ https://blessed.readthedocs.io/en/1.23/keyboard_kitty.html ・ https://github.com/vim/vim/issues/16318
