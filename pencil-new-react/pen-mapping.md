# pen-mapping

## 说明与事实来源
- 当前环境未修改 `/Users/nunu/frontend/pencil-new.pen` 文件本体。
- 本文件只记录**当前 React 实现**与 `.pen` 设计稿之间的对应关系，不再记录逐步施工历史。
- 当前映射依据：
  - `.pen` 文件文本内容
  - `src/pages/V5StagePage.tsx`
  - `src/pages/V5StagePage.module.css`
  - `src/content/*.ts`
- 由于当前目录不是 git 仓库，本文件不区分代码作者来源，只对齐当前文件系统中的真实状态。

## 页面级映射总览
| React 页面 | `.pen` 页面 | 当前状态 | 备注 |
|---|---|---|---|
| `V5StagePage` | `V5 中央 Live2D 舞台版 (cN516)` | 首页静态还原已完成到第 17 步 | 第 16 步 Live2D 主体接入仍暂缓 |

## 区域映射表
| React 区域 / 组件 | `.pen` 对应 | 代码入口 | 当前状态 |
|---|---|---|---|
| 页面右上发光背景 | `cornerGlowTR (wdBcs)` | `V5StagePage.tsx` + `V5StagePage.module.css` | 已完成当前版本，仅作为背景 glow 存在 |
| 左侧学习导航栏 | `sideRail (t7NrN)` | `SideRailNav` + `sideRailContent.ts` | 已完成真实静态内容 |
| 顶部标题区 | `headerLayer (sAmet) / topRow` | `TopRowHeader` + `headerContent.ts` | 已完成真实静态内容 |
| 顶部阶段路径条 | `headerLayer (sAmet) / pathBar` | `PathBar` + `headerContent.ts` | 已完成真实静态内容 |
| 左上预习卡上方引导字 | `leftInputRail (uBqRn) / previewCard 上方微型引导字` | `PreviewGuideText` + `leftRailContent.ts` | 已完成真实静态内容 |
| 左上预习卡 | `leftInputRail (uBqRn) / previewCard` | `PreviewCard` + `leftRailContent.ts` | 已完成真实静态内容 |
| 左侧路径装饰区 | `leftInputRail (uBqRn) / leftSpacer` | `LeftSpacerPath` + `leftRailContent.ts` | 已完成真实静态内容，当前版本为已验收通过版本 |
| 左下视频卡 | `leftInputRail (uBqRn) / videoCard` | `VideoCard` + `leftRailContent.ts` | 已完成真实静态内容 |
| 中央问题带 | `heroStage (diM2A) / questionBand` | `QuestionBand` + `heroContent.ts` | 已完成真实静态内容 |
| 中央舞台主结构 | `heroStage (diM2A) / centerArena` | `CenterArenaReservedStage` | 已完成当前静态舞台版本，仅限 Live2D 预留舞台 |
| Live2D 预留区 | `heroStage (diM2A) / centerArena / reserved area` | `.centerArenaReservedArea` | 已完成当前预留容器，未接入运行时主体 |
| 中央舞台左上角装饰 | `heroStage (diM2A) / centerArena 左上角装饰` | `CenterArenaDecorations` | 已完成真实静态内容 |
| 中央舞台左下角装饰 | `heroStage (diM2A) / centerArena 左下角装饰` | `CenterArenaDecorations` | 已完成真实静态内容 |
| 中央舞台右下角 DNA 装饰 | `heroStage (diM2A) / centerArena 右下角 DNA 装饰` | `CenterArenaDecorations` | 已完成真实静态内容；这是舞台绑定装饰，不属于页面级 DNA 系统 |
| 底部进入对话区 | `heroStage (diM2A) / dialogueEntry` | `DialogueEntry` + `heroContent.ts` | 已完成真实静态内容，但仍是静态入口，不含真实输入行为 |
| 右上互动卡上方引导字 | `rightExploreRail (t1Jfl) / interactionCard 上方微型引导字` | `InteractionGuideText` + `rightRailContent.ts` | 已完成真实静态内容 |
| 右上互动卡 | `rightExploreRail (t1Jfl) / interactionCard` | `InteractionCard` + `rightRailContent.ts` | 已完成真实静态内容 |
| 右侧路径装饰区 | `rightExploreRail (t1Jfl) / rightSpacer` | `RightSpacerPath` + `rightRailContent.ts` | 已完成真实静态内容，核心几何以 `leftSpacer` 当前通过版为强模板 |
| 右下拓展卡 | `rightExploreRail (t1Jfl) / extensionCard` | `ExtensionCard` + `rightRailContent.ts` | 已完成真实静态内容 |
| 页面级左上分子纹理 | `bioTextureTopLeft (WxkvD)` | `PageBioTextures` | 已完成真实静态内容，属于页面级背景陪衬 |
| 页面级右下分子纹理 | `bioTextureBottomRight (WU72G)` | `PageBioTextures` | 已完成真实静态内容，属于页面级背景陪衬 |

## 当前仍未完成内容
- 第 16 步：Live2D 主体接入与运行时联动
- `dialogueEntry` 的真实输入能力与 CTA 行为
- 页面动画、hover、业务逻辑与数据联动

## 补充说明 / 特殊边界
- `centerArena` 右下 DNA 与第 17 步页面级分子纹理不是同一层语义：
  - `centerArena` DNA = 舞台绑定装饰
  - `bioTextureTopLeft / bioTextureBottomRight` = 页面级背景纹理
- `leftSpacer` 与 `rightSpacer` 当前都视为已验收通过的路径区版本：
  - `leftSpacer` 是左侧参数参考模板
  - `rightSpacer` 在此基础上完成镜像与右侧差异调整
- `centerArena` 当前是为未来 Live2D 预留的舞台容器，不代表机器人主体已经实现。
- 本文件只负责“当前实现对应哪里”，不负责记录施工顺序；施工顺序以 `IMPLEMENTATION_PLAN.md` 的当前审计版说明为准。
