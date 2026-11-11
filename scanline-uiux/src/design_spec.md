# Scanline · 导航架构与交互规格说明书

> 版本:v1.0(2026-11-09,第一批确认版)｜ 取代:无(首版)
> 交付对象:实现 AI / 开发
> 设计语言:Apple Human Interface Guidelines 基线(SF Pro/苹方、SF Symbols、原生控件)——**按平台落地各自风格**(见 §7.0 平台风格映射),结构唯一、不强制外观统一
> 配套资产:`index.html`(图集,含深浅主题联动)+ 13 个 HTML 轨页面原型 + `01-ia-flow.svg`(SVG 轨)+ `tokens.json`
> 冲突时以本文件文字为准;本文未覆盖处遵循 nsh 官方《设计指南》(platform-first 原则)

## 0. 如何使用本规格

| 你要做什么 | 看哪里 |
|---|---|
| 理解整体结构 | §2 + `01-ia-flow.svg` |
| 实现某个界面 | §3–§6 对应节 + 同名 HTML 原型(可直接读代码) |
| 取颜色/圆角/字号 | `tokens.json`(唯一事实源;禁止写死 HEX) |
| 判断某功能放哪 | §1 铁律 + §10.1 归属判断流程 |
| 验收 | §9 清单逐项勾 |

优先级:**本文文字 > HTML 原型 > SVG > 旧文档**。

## 1. 全局铁律(逐条可验收)

1. 层级封顶 ≤3 层;PTY 会话在任何导航下保持运行
2. 跨层只走 sheet/popover;**回到终端永远 ≤1 步**(Esc / 活动栏)
3. 命令块单例、两种呈现:终端内 inline(调用)+ 块历史/块详情(管理);数据层唯一(同一 block store)
4. 目的地 = 平级,目的地内不放内容展开;详情一律 push
5. **同名同图标同序,只换容器**:手机底部 Tab Bar ↔ 桌面活动栏 ↔ (预留)TUI 菜单;Android=手机容器,Web=桌面容器
6. 常驻工具 ≤5 组(新建会话/分屏/agent/命令面板/设置),低频进 ⋯
7. AI 上下文来源必须标注(=本块/=本会话);未配模型时 AI 入口显示**引导态**而非报错
8. 浮层不抢终端焦点:审批阻塞执行但输出可见;面板 Esc 关闭即回终端

## 2. 信息架构总览

```
Scanline 窗口
├─ 标题栏(Win32:应用名居左,控制钮右置)…………… 全部视图常驻
├─ 活动栏(应用级,48px;会话之外)……………… rail-terminal-view / blocks-history / settings
│   ├─ 终端视图(默认)
│   │   ├─ 会话标签条(只属于本视图)……… rail-terminal-view.html
│   │   ├─ 输入区(NL 常驻)+ 块流
│   │   └─ 状态矩阵 7 态 ………………………… terminal-*.html
│   ├─ 块历史视图(搜索/筛选/卡片)…………… blocks-history.html
│   │   └─ push:块详情 ………………………… block-detail.html
│   └─ 设置视图(分组导航 + 内容)……………… settings.html
├─ 全局浮层(非层)………………………………… palette.html / trust-approval.html
│   ├─ 命令面板(Ctrl+K;命令/NL/块检索)
│   └─ 执行审批(差异预览+三选)
└─ 状态栏(cwd/分支/延迟/BYOK/主题)………… 全部视图常驻(内容随视图切换)
```

对应图:`01-ia-flow.svg`。

## 3. 活动栏(应用级导航)

**结构**:全高(标题栏→状态栏)、48px、图标三项连排:终端 / 块历史 / 设置——与移动端底部 Tab Bar 同名同图标同序(铁律 5 同构映射)。
**交互**:点击切换整个视图;PTY 与工作状态永不销毁。
**状态**:激活 = `c-tint` 底 + 主色图标;未激活 = `ink-4`。
**设计理由**:入口显性化且与应用层/会话层解耦;宽侧栏 220px(图标+文字)为可选形态,默认窄栏。
**文件**:`rail-terminal-view.html`(终端 active)、`blocks-history.html`(块历史 active)、`settings.html`(设置 active)。
**可选形态**:宽侧栏见 `_drafts/terminal-rail-sidebar.html`(探索稿,不作交付)。

### 3.1 设置视图(应用层第三视图)

**结构**:双栏——左分组导航(200px:外观 / 终端行为 / AI 模型 / 插件 / 快捷键 / 关于)+ 右内容;**内容页 = HIG 行式分组**(分组卡片内 label + 次级描述 + 状态 chip + chevron 行,点行 push 配置子页;开关类用 switch)——禁止营销卡布局;分组随插件注册动态增减(微内核:各插件可注册设置分区)。
**AI 模型页**(BYOK):引导态横幅(未配模型不报错)+ 「模型提供方」组(Ollama 本地[推荐·零云依赖]/ OpenAI 兼容 / Anthropic,点行 push 配置)+ 「AI 行为」组(幽灵补全 / 命令解释 switch——AI-optional 的最小粒度)。
**三端同构**:桌面 = 活动栏第三项 + 双栏视图;手机 = Tab 3 → 组列表 push → 组内容页——**分组、顺序、内容一一对应**,仅容器不同。
**文件**:`settings.html`;间距遵守 4/8 节奏(容器 20/24)。

## 4. 终端视图(默认;会话之内采用 C 方案块流)

**结构**(自上而下):会话标签条(38px;标签带**类型图标**——终端 ❯ / 文件 / 隧道 / 远程桌面,会话类型是一等属性[特性 29];+ 打开**类型菜单**:终端[MVP]/文件(SFTP)[v1.0]/隧道[v1.0]/远程桌面[v1.0]/agent 窗格[MVP,split];激活标签 = 卡片式[bg-card+描边,两主题皆有浮起感];右端 = agent split 入口、Ctrl+K 芯片)→ 输入区(NL chip + 等宽输入 + 发送)→ 块流(命令块卡片流,**恒深表面 .termsurface**)→ 状态栏。
**交互**:回车执行(生成新块);NL 生成命令 → 预览确认 → 执行;点块 → 块内快捷动作(解释/详情);点 ☰ 类控件无——块历史走活动栏。
**状态矩阵**(骨架不变,每态一页):

| 状态 | 文件 | 要点 |
|---|---|---|
| 空闲 | `terminal-idle.html` | 提示符+光标;连接保持 |
| 重输出 | `terminal-streaming.html` | 黄点运行块;自动跟随;不锁输入;内核热路径 |
| 幽灵补全 | `terminal-ghost.html` | 灰字内联(非浮层);Tab 采纳/Esc 忽略;来源标注于状态栏 |
| 块失败 | `terminal-block-fail.html` | 红点+退出码进块头;块内快捷动作(解释/详情) |
| AI 解释 | `terminal-ai-explain.html` | popover 锚定失败块;来源透明;「生成修复命令」需确认 |
| 断线重连 | `terminal-disconnect.html` | 黄横幅+倒计时+手动重连;内容 .faded 保留;输入闸门 |
| 全屏程序(网格接管) | `terminal-takeover.html` | 会话表面切换为传统网格(vim/htop 100%);活动栏/标签条/状态栏常驻;Esc 退出回块流 |

**设计理由**:块流吸收 C 方案的 AI-native 优势;「全屏接管」守住 TUI 兼容红线;两者由 VT 序列自动切换(应用不可配置)。

## 5. 块历史视图 + 块详情

**块历史**(`blocks-history.html`):搜索(命令/输出/目录)+ 筛选 chips(全部/成功/失败/收藏 + 会话筛选)+ 管理卡片(元数据:退出码/来源会话/耗时/收藏)。作用域 = 跨会话全库——与终端视图的会话内输出是**两个作用域**,分工写明。
**块详情**(`block-detail.html`,push):‹ 返回 + 标题 + 对象 ⋯(收藏/复制命令/导出/删除)→ 元数据 chips → 命令 → 输出全文 → AI 解释(上下文=本块)→ 审计轨迹(创建/审批/执行/退出/AI 生成,时间轴)。
**设计理由**:铁律 3 的两种呈现;审计轨迹是信任基础设施的回放面。

## 6. 全局浮层

**命令面板**(`palette.html`):Ctrl+K(手机=悬浮球)唤起,任何视图可用;三合一输入,作用域显式分工:命令执行 / NL 生成(**必须预览确认**) / 块检索。命令列表来自命令注册表——由各插件注册,面板不内置具体命令。
**执行审批**(`trust-approval.html`):触发 = agent/插件请求执行需审批命令。结构:红头(来源+会话+任务依据)→ 命令 → 影响预览(自然语言+事实)→ 三选(本次允许/加入白名单(可撤销)/拒绝)→ 审计落档。阻塞执行但输出可见(铁律 8)。
**设计理由**:对抗 agent 幻觉/谎报(P11;行业空位 G5)——解释可以随便给,执行必须过闸。

### 6.1 会话类型视图(文件 / 隧道 / 远程桌面 / agent 窗格)

| 视图 | 文件 | 要点 |
|---|---|---|
| 文件会话(SFTP) | `sessions-file.html` | Xshell 式:路径栏(远端路径+连接态+上传/下载)+ 文件表(大小/时间/权限)+ 传输队列(进度/暂停/取消);拖拽到窗口 = 传输 |
| 隧道会话 | `sessions-tunnel.html` | 会话级仪表(连接态/时长/双向流量)+ 规则表(本地 L/远程 R/动态 SOCKS5,单规则可暂停)+ 近期事件(恒深 log) |
| 远程桌面 | `sessions-rdp.html` | IronRDP 帧画面 + 悬浮工具条(整窗接管/缩放/剪贴板/CAD/断开)+ 状态栏分辨率/帧率/延迟/带宽;**整窗接管语义归此类型独享** |
| agent 窗格 | `agent-pane.html` | 终端视图内右 split(380px);agent 步骤流 + inline 审批卡(危险升级全局弹层)+ 窗格输入(过审批闸);手机端 = 全屏 cover |

共同约束:均为**会话类型**(住标签条,带类型图标,特性 29);应用层 chrome 常驻;块模型目前仅终端作用域,文件/隧道产生各自记录类型(活动库泛化议题,v1.0 设计再议)。

## 7. 设计语言与 Token

### 7.0 设计语言基线与平台风格映射
基线 = Apple HIG(本包图面即 HIG 表达);**结构唯一,风格随平台**:

| 平台 | chrome 材质 | 密度/交互 | 控件 |
|---|---|---|---|
| Windows(基准) | Mica/Acrylic 等效或高不透明降级 | 紧凑(Fluent);键盘优先;控制钮右置 | nsh Win32 原生 |
| macOS | 原生 Liquid Glass glassEffect(iOS/macOS 26) | HIG 惯例 | nsh AppKit 原生 |
| Linux | GTK 主题跟随 | GNOME HIG | nsh GTK4 原生 |
| Android | Material 3 表面 | 触摸目标/安全区/返回手势 | nsh 原生视图 |
| Web | CSS backdrop-filter(原型即此) | 指针/触摸自适应 | HTML/CSS |
| TUI(fast-follow) | 终端配色 | 整数 Cell、键盘优先 | ratatui 后端 |

### 7.1 字阶
`tokens.json › typography.scale`(large-title 30/800 → micro 10.5/400);终端文本用 `mono-stack`;UI 文本用 `stack`。
### 7.2 Token 摘要
全量见 `tokens.json`(深色为 `$value`,浅色 `$light`,换值不换名);品牌双轨:`c-primary`(交互,HIG 蓝)+ `c-brand`(磷光绿,CRT 身份,CRT 皮肤层可重映射)。
### 7.3 主题
深色优先;终端内容面**恒深**:`bg-term` + 恒定 token 组(`term-ink/term-card/term-elev/term-sep`,两主题同值),终端视图的流区域套 `.termsurface` 作用域类——浅色 chrome + 深色内容面并存;CRT 主题族 = 语义 token 之上的皮肤层(配色/光标/扫描线),主题试穿 = 全屏 cover(后续批次)。
### 7.4 图标
单色矢量(24 网格/圆头/`currentColor`),SF Symbols 对照注释;禁 emoji;`icons.js` 注册表统一供体。
### 7.5 多端字体
不捆绑字体;system-ui 栈按端回退(Apple→SF Pro/苹方,Android→Roboto/思源黑体,Windows→Segoe UI/雅黑);不加载 CJK webfont;一致性 = 字阶/字重/行高/间距,不比像素级字体一致。

## 8. 数据模型与实现要点

```
Session { id, type: terminal|file|tunnel|rdp(插件可扩展), name, host_ref,
          status: running|disconnected|closed, created_at }
Block   { id, session_id, seq, cmd, output, exit_code, duration_ms, created_at,
          origin: user|agent|nl_confirmed, starred,
          approval: null | { decision: allow|allowlist|deny, actor, at },
          ai_explain: null | { provider_id, model, text, created_at } }
Provider{ id, kind: openai_compat|anthropic|ollama, endpoint, key_ref(本机钥匙串), model }
Plugin  { id, version, permissions[], commands[], views[], settings_sections[] }
```

关键规则:
1. **块生命周期**:回车/确认执行 → 创建块(running)→ 输出流入 → 退出码落档 → 审计追加;NL 生成的命令必须带 `origin=nl_confirmed` 且执行前过审批。
2. **AI 上下文组装顺序**:当前块 → 当前会话最近 N 块摘要 → 无任何全局隐式上下文;每次调用在 UI 标注来源。
3. **审批链路**:插件请求执行 → 影响预览 → 三选 → 写审计 → allowlist 存本地可撤销。
4. **全屏程序(网格接管)**:VT 全屏序列 → 会话表面切换为传统网格;应用级 chrome(活动栏/标签条/状态栏)常驻不隐藏;程序退出或 Esc 退出回块流。**整窗接管**(含活动栏隐藏)预留给远程桌面类会话(v1.0 波,session type = rdp)。
5. 边界:超长输出(块内全文可滚动,流视图截断+「查看详情」);断线(内容保留/输入闸门/自动重连);多会话并发(块按 session_id 归档,块历史聚合);插件关闭(AI 插件组可整体关闭 = AI-optional)。

## 9. 验收清单

- [ ] 架构:层级 ≤3;切视图 PTY 存活;回终端 ≤1 步
- [ ] 活动栏:三项连排,与移动 Tab 同名同图标同序;激活态 `c-tint`
- [ ] 终端视图:7 态齐备(文件名逐一对上);全屏接管隐藏活动栏/输入区/块流
- [ ] 块模型:inline 与管理视图数据同源;审计轨迹 4 类事件齐全
- [ ] 浮层:面板三区作用域不重叠;审批三选 + 影响预览 + 审计落档
- [ ] BYOK:未配模型全 AI 入口 = 引导态;Ollama 路径离线可用
- [ ] HTML 轨:引四资产;无业务 script;无散落 HEX;stage 固定尺寸;pin 连续且与面板一一对应
- [ ] Token:全包无 HEX(tokens.json/tokens.css 之外);深浅两主题渲染通过
- [ ] **正式 UI 零解释性文本**:开发/设计说明只存在于 pin + 面板与图集 caption;示例内容为真实感内容(grep 无「示意」「此处截断」等字样)——let the layout explain
- [ ] 图标:全部矢量(icons.js 注册表),无 emoji
- [ ] 快捷键全表唯一(见 §10.3)
- [ ] 基准端 = Windows 桌面;风格随平台(§7.0 映射表)

## 10. 附录

### 10.1 新功能归属判断流程
会话之外且无会话可存在 → 活动栏目的地;附着连接/会话 → 终端视图内(窗格/标签/会话属性);调用类 → 命令面板;横切执行安全 → 审批层。先答归属,再动笔。

### 10.2 资产索引(域词表登记)
域词表(8):`terminal / blocks / palette / trust / agent / settings / themes / sessions`。
当前资产:`01-ia-flow.svg`(§2)· `rail-terminal-view.html`(§4 基准)· `blocks-history.html`(§5)· `block-detail.html`(§5)· `settings.html`(§3/§5)· `palette.html`(§6)· `trust-approval.html`(§6)· `sessions-file.html` / `sessions-tunnel.html` / `sessions-rdp.html` / `agent-pane.html`(§6.1)· `terminal-{idle,streaming,ghost,block-fail,ai-explain,disconnect,takeover}.html`(§4 矩阵)。
命名法:`{域}-{语义名}[-{状态}][-{端}]`;基准端 = Windows 桌面(偏离技能默认 iPhone 的理由:开发/验收主平台 + 终端主力形态;手机容器为 Android 派生)。

### 10.3 快捷键总表(桌面;已查重)

| 快捷键 | 动作 |
|---|---|
| Ctrl + K | 命令面板 |
| Ctrl + T | 新建终端会话 |
| Ctrl + Shift + A | 打开 agent 窗格 |
| Ctrl + Shift + T | 主题试穿 cover |
| Tab / Esc | 采纳 / 忽略幽灵补全 |
| Esc | 关闭浮层 / 退出全屏接管 |

### 10.4 待办批次(确认第一批后)
主题试穿 cover · 设置›外观页 · 块历史空态细化 · Android 派生容器 · Web 同形核验 · v1.0 波(类型选择菜单/SFTP/隧道/RDP 视图/插件管理页)
