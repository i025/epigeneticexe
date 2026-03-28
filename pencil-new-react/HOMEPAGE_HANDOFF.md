# HOMEPAGE_HANDOFF

## 项目与页面概览
- 项目目录：`/Users/nunu/frontend/pencil-new-react`
- 技术栈：React + Vite + TypeScript + CSS Modules
- 当前首页是对 `.pen` 设计稿 `V5 中央 Live2D 舞台版 (cN516)` 的静态前端还原版。
- 当前交付状态：
  - 已完成第 1-15 步与第 17 步
  - 第 16 步 Live2D 主体接入仍暂缓
  - 页面当前以**静态视觉还原**为主，不包含真实交互和业务逻辑
- 当前目录不是 git 仓库，因此以下总结只描述**当前文件系统中的真实状态**，无法区分“最初实现”和“后续人工调整”。

## 设计稿与代码的 Source of Truth
- 设计稿源文件：`/Users/nunu/frontend/pencil-new.pen`
- 页面主结构代码：
  - `src/pages/V5StagePage.tsx`
  - `src/pages/V5StagePage.module.css`
- 页面文案与内容源：
  - `src/content/sideRailContent.ts`
  - `src/content/headerContent.ts`
  - `src/content/heroContent.ts`
  - `src/content/leftRailContent.ts`
  - `src/content/rightRailContent.ts`
- 当前映射与实现状态文档：
  - `IMPLEMENTATION_PLAN.md`
  - `pen-mapping.md`
- 建议后续所有修改都遵循这条顺序：
  1. 先看 `.pen`
  2. 再看 `V5StagePage.tsx` 的组件结构
  3. 再看 `V5StagePage.module.css` 的几何和层级
  4. 最后才改 content 文件或补文档

## 当前交付状态总览
- 已完成的页面层级：
  - 固定骨架与背景
  - 左侧学习导航
  - 顶部品牌标题区与阶段路径条
  - 四张功能卡
  - 轨道小字与右上 glow
  - 中央问题带
  - `centerArena` Live2D 预留舞台
  - 底部 `dialogueEntry`
  - 左右路径装饰区
  - `centerArena` 周边装饰
  - 页面级分子纹理装饰
- 当前有意留白的部分：
  - Live2D 主体与运行时
  - 真实聊天输入和按钮点击逻辑
  - 动画、hover、业务状态

## 首页相关文件清单
| 文件 | 作用 | 依赖 / 内容源 | 当前状态 | 后续修改注意点 |
|---|---|---|---|---|
| `src/main.tsx` | React 入口，挂载根组件与全局样式 | `App.tsx`、`global.css` | 稳定 | 基本无需改，除非引入全局 provider |
| `src/App.tsx` | 首页外层承载，只负责包裹 `V5StagePage` | `App.module.css`、`V5StagePage` | 稳定 | 不建议把业务逻辑塞进这里 |
| `src/App.module.css` | 外层留白和视口承载样式 | 无 | 稳定 | 影响整体页边距与最小宽度，改动要谨慎 |
| `src/styles/global.css` | 全局字体、背景基色、基础 reset | 无 | 稳定 | 会影响全局排版和背景，避免误伤局部组件 |
| `src/vite-env.d.ts` | Vite 类型声明 | Vite | 稳定 | 基本不用动 |
| `src/pages/V5StagePage.tsx` | 首页主页面，组合所有局部组件、SVG 和装饰 | 全部 content 文件、`V5StagePage.module.css` | 核心文件 | 文件体量大，后续优先拆组件，不要继续无节制堆逻辑 |
| `src/pages/V5StagePage.module.css` | 首页全部布局、几何、层级和视觉细节 | `V5StagePage.tsx` | 核心文件 | 几何硬编码很多，改动前先确认会不会破坏已验收区域 |
| `src/content/sideRailContent.ts` | 左侧学习导航文案和分组结构 | 无 | 稳定 | 只放内容，不要放布局逻辑 |
| `src/content/headerContent.ts` | 顶部标题区和路径条文案 | 无 | 稳定 | 路径条步骤顺序与 tone 由这里控制 |
| `src/content/heroContent.ts` | 中央主问题与底部对话入口文案 | 无 | 稳定 | 当前只包含 `questionBand` 和 `dialogueEntry` 文案 |
| `src/content/leftRailContent.ts` | 左侧轨道小字、leftSpacer 标签、预习/视频卡文案 | 无 | 稳定 | 左侧路径区标签改动会直接影响 `LeftSpacerPath` |
| `src/content/rightRailContent.ts` | 右侧轨道小字、rightSpacer 标签、互动/拓展卡文案 | 无 | 稳定 | 右侧路径区标签改动会直接影响 `RightSpacerPath` |
| `IMPLEMENTATION_PLAN.md` | 当前态审计文档，记录已完成范围、冻结边界和后续建议 | 当前代码与 `.pen` | 已重写为交接版 | 后续不要再堆施工流水账 |
| `pen-mapping.md` | 当前实现与 `.pen` 节点映射 | 当前代码与 `.pen` | 已重写为映射版 | 用来回答“React 对应设计稿哪里” |

## 每个组件 / 局部组件的职责说明
| 组件 / helper | 作用 | 依赖什么 | 当前状态 | 最容易踩的坑 |
|---|---|---|---|---|
| `PlaceholderBlock` | 早期骨架占位块 | `V5StagePage.module.css` | 仍保留在代码里，但当前首页已不再挂载 | 历史残留 helper，如确认不会再用，可后续删除 |
| `toneClassName` | 把 `SideRailTone` 映射到导航分组样式 | `sideRailContent.ts` | 稳定 | 改 tone 名称时要同步 content 和 CSS |
| `pathStepClassName` | 把 `PathStepTone` 映射到路径条样式 | `headerContent.ts` | 稳定 | 同上，tone 与 CSS 要一一对应 |
| `SideRailNav` | 渲染左侧学习导航栏 | `sideRailContent.ts` | 已验收 | 结构和内容都视为冻结，不要把交互塞进这里 |
| `TopRowHeader` | 渲染顶部品牌标题、中间说明、右侧 meta | `headerContent.ts` | 已验收 | 左侧标题必须保持单行，不要让中右内容反压标题 |
| `PathDivider` | 路径条中的短虚线分隔 | `PathBar` | 稳定 | 只是视觉 helper，不要赋予业务含义 |
| `PathBar` | 渲染建议学习路径 | `headerContent.ts` | 已验收 | 步骤顺序和当前阶段高亮已冻结 |
| `hexagonPoints` | 页面级分子纹理的六边形点位生成 helper | `PageBioTextures` | 稳定 | 只服务纹理 SVG，不要误用于其他几何 |
| `PageBioTextures` | 渲染左上 / 右下页面级分子纹理 | 常量数组 + `pageBioTexture*` 样式 | 已验收 | 这是页面级背景陪衬，不要和 `centerArena` DNA 混用 |
| `QuestionBand` | 渲染中央主问题标题 | `heroContent.ts` | 已验收 | 标题体量和位置已冻结，不要轻易回改 |
| `centerArenaDnaPairBars` | `centerArena` DNA 配对条颜色和位置常量 | `CenterArenaDecorations` | 稳定 | 这是舞台装饰数据，不属于全页纹理 |
| `CenterArenaDecorations` | 渲染 `centerArena` 左上 / 左下装饰和右下 DNA | 本地常量 + CSS | 已验收 | 位置已经收口，后续只能轻调，不要重排内部结构 |
| `CenterArenaReservedStage` | 渲染中央舞台背景、Live2D 预留区、装饰层和底座 | `CenterArenaDecorations` + CSS | 已验收 | 这是后续 Live2D 的唯一正确接入锚点 |
| `DialogueEntry` | 渲染底部对话入口容器、提示文案与 CTA | `heroContent.ts` | 已验收 | 当前只是静态入口，不是真实输入框 |
| `PreviewGuideText` | 左侧轨道微型引导字 | `leftRailContent.ts` | 已验收 | 仅是轻提示层，不进入卡片内部 |
| `LeftSpacerPath` | 左侧路径装饰区双轨道和节点标签 | `leftRailContent.ts` | 已验收 | 当前是右侧路径的强模板，不要回改 |
| `PreviewCard` | 左上预习卡 | `leftRailContent.ts` | 已验收 | CTA、图标、正文体量和位置都已冻结 |
| `VideoCard` | 左下视频卡 | `leftRailContent.ts` | 已验收 | 与预习卡的错位关系已冻结 |
| `InteractionGuideText` | 右侧轨道微型引导字 | `rightRailContent.ts` | 已验收 | 仅是轻提示层，不进入卡片内部 |
| `InteractionCard` | 右上互动卡 | `rightRailContent.ts` | 已验收 | 偏左摆位和图标状态已收口 |
| `RightSpacerPath` | 右侧路径装饰区双轨道和节点标签 | `rightRailContent.ts` | 已验收 | 几何强依赖左侧模板，不要从零重画 |
| `ExtensionCard` | 右下拓展卡 | `rightRailContent.ts` | 已验收 | 与互动卡的上下对位关系已冻结 |
| `V5StagePage` | 组合首页全部区域与装饰层 | 全部 content 文件、全部局部组件 | 当前首页总装配入口 | 后续如果继续扩展，优先拆分，不要继续堆大文件 |

## 当前 `.pen` 到代码的整体关系
- `.pen` 顶层页面 `cN516` 当前对应整个 `V5StagePage`。
- 当前顶层子区域在代码中的对应关系是：
  - `cornerGlowTR` → 右上 glow 背景
  - `sideRail` → `SideRailNav`
  - `headerLayer` → `TopRowHeader` + `PathBar`
  - `leftInputRail` → `PreviewGuideText`、`PreviewCard`、`LeftSpacerPath`、`VideoCard`
  - `heroStage` → `QuestionBand`、`CenterArenaReservedStage`、`DialogueEntry`
  - `rightExploreRail` → `InteractionGuideText`、`InteractionCard`、`RightSpacerPath`、`ExtensionCard`
  - `bioTextureTopLeft` / `bioTextureBottomRight` → `PageBioTextures`
- `centerArena` 相关有一条必须记住的语义边界：
  - `centerArena` 右下 DNA = 舞台绑定装饰
  - 页面左上 / 右下分子纹理 = 页面级背景陪衬

## 已完成内容与有意留白内容
### 已完成内容
- 首页主要视觉骨架和所有静态区域都已建立。
- 左右路径区和中央舞台周边装饰都已落地。
- 页面级分子纹理也已落地。

### 有意留白内容
- `centerArenaReservedArea` 目前仍是空容器，只作为 Live2D 预留区。
- `dialogueEntry` 当前是静态视觉入口，不是可输入的聊天组件。
- 所有 CTA 当前都不具备真实点击行为。
- 当前没有 hover、动画、状态切换和业务联动。

## 后续还可以做什么改进
1. 把 `V5StagePage.tsx` 拆成更小的页面级组件文件，例如：
   - `components/home/SideRailNav.tsx`
   - `components/home/HeaderLayer.tsx`
   - `components/home/CenterArenaStage.tsx`
   - `components/home/RailDecorations.tsx`
2. 把页面级纹理、DNA、左右路径区的几何常量单独抽到 `src/content` 或 `src/config`，降低页面文件的硬编码密度。
3. 给首页增加 visual regression 截图校验，避免后续微调破坏已验收几何。
4. 给 CTA、导航和关键标题补更完整的语义和可访问性属性。
5. 如果未来需要适配更多分辨率，应该先定义**缩放策略**，而不是直接改现有绝对定位数值。
6. 如果要引入真实交互，建议先把“视觉层”和“行为层”拆开，避免在现有 CSS 几何结构里混入状态逻辑。
7. `PlaceholderBlock` 属于历史残留 helper，如果确认未来不再用，可以清理。

## Live2D 自行接入方法
### 推荐接入位置
- 当前正确接入点是 [V5StagePage.tsx](/Users/nunu/frontend/pencil-new-react/src/pages/V5StagePage.tsx) 里的 `CenterArenaReservedStage()`。
- 保留现有注释，不要删除：
  - `Reserved container for future Live2D character`
  - `Keep visually minimal in current step`
  - `Do not replace with static robot`
- 当前预留容器是 [V5StagePage.module.css](/Users/nunu/frontend/pencil-new-react/src/pages/V5StagePage.module.css) 中的 `.centerArenaReservedArea`：
  - `width: 520px`
  - `height: 540px`
  - `transform: translateY(-28px)`

### 推荐接入方式
1. 新增独立组件，例如：
   - `src/features/live2d/Live2DStage.tsx`
   - 或 `src/components/live2d/Live2DStage.tsx`
2. 模型资源建议放到：
   - `public/live2d/<model-name>/`
3. 在 `CenterArenaReservedStage()` 里把预留容器改成可挂子节点的形式，例如：

```tsx
<div className={styles.centerArenaReservedArea}>
  <Live2DStage modelPath="/live2d/your-model/model3.json" />
</div>
```

4. `Live2DStage` 组件内部再去初始化你选择的运行时：
   - `pixi-live2d-display`
   - 官方 Cubism SDK 封装
   - 或你自己的 canvas / WebGL wrapper

### 接入时的布局原则
- 优先把 Live2D 挂在 `centerArenaReservedArea` 里，不要先改：
  - 背景圆
  - 双层底座
  - `dialogueEntry`
  - 左右路径区
- 如果模型出界，优先调这些：
  - 模型内部 transform
  - camera / fit
  - canvas 尺寸
  - 模型的初始偏移
- 不要一上来就改 `centerArenaReservedArea` 的宽高和整个舞台比例。

## Live2D 接入注意事项
1. 默认保持非交互：
   - 当前 `.centerArenaReservedArea` 是 `pointer-events: none`
   - 如果你需要点击交互，再单独为 Live2D mount wrapper 打开事件，不要直接把整层都改成可交互
2. 注意层级关系：
   - `questionBand` 必须继续高于舞台背景
   - `dialogueEntry` 不能被模型压住
   - 左右路径区不能被模型侵占
   - `centerArena` 周边装饰默认是陪衬层，如果模型边缘被轻微遮挡，优先调整模型位置，不要先改装饰
3. 注意性能：
   - 模型资源尽量懒加载
   - 首屏不要阻塞主内容渲染
   - 失败时要有兜底，不要让整个首页白屏
4. 注意高清屏：
   - canvas 要按 `devicePixelRatio` 处理
   - 否则模型可能发虚
5. 注意销毁：
   - 组件卸载时要释放 runtime、ticker、纹理和事件监听
   - 避免切页或热更新后重复挂载
6. 不要把静态机器人图当成最终方案：
   - 当前结构明确要求这里是 Live2D 预留区
   - 如果只想临时验证位置，最多做开发期临时占位，不要写回正式实现

## 最后建议
- 如果你准备自己接入 Live2D，建议下一步顺序是：
  1. 先新建 `Live2DStage` 独立组件
  2. 先做资源加载和销毁闭环
  3. 再把它挂到 `centerArenaReservedArea`
  4. 最后做层级、交互和性能联调
- 不建议再回头重做首页骨架、四张卡、左右路径区和 `centerArena` 静态几何。当前版本已经适合作为 Live2D 接入底座。
