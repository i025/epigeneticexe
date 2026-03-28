# IMPLEMENTATION_PLAN

## 当前状态总览
- 项目目录：`/Users/nunu/frontend/pencil-new-react`
- 设计稿来源：`/Users/nunu/frontend/pencil-new.pen`
- 当前首页实现是一个**静态前端还原版**，已完成第 1-15 步与第 17 步；第 16 步 Live2D 主体接入仍暂缓。
- 当前页面已具备：
  - 固定骨架与三栏布局
  - 左侧学习导航
  - 顶部标题区与阶段路径条
  - 四张功能卡
  - 中央问题带、Live2D 预留舞台、底部进入对话区
  - 左右路径装饰区
  - `centerArena` 周边装饰
  - 页面级分子纹理装饰
- 当前页面**不包含**：
  - Live2D 运行时
  - 真实聊天输入 / 按钮点击逻辑
  - 动画、hover、业务联动
- 由于当前目录不是 git 仓库，本文件只描述**当前文件系统中的真实状态**，不区分代码作者来源。

## 首页代码与设计稿的事实来源
- 页面主实现：
  - `src/pages/V5StagePage.tsx`
  - `src/pages/V5StagePage.module.css`
- 页面内容源：
  - `src/content/sideRailContent.ts`
  - `src/content/headerContent.ts`
  - `src/content/heroContent.ts`
  - `src/content/leftRailContent.ts`
  - `src/content/rightRailContent.ts`
- 页面入口与外层承载：
  - `src/main.tsx`
  - `src/App.tsx`
  - `src/App.module.css`
  - `src/styles/global.css`
  - `src/vite-env.d.ts`
- 设计稿事实来源以 `pencil-new.pen` 文本内容为主，`pen-mapping.md` 用于记录当前 React 实现与 `.pen` 节点的对应关系。

## 已完成范围
### 第 1-4 步：骨架、sideRail、header、pathBar
- 已完成页面固定画布与外层承载，当前骨架以 `1720 x 1120` 设计尺寸为基准。
- 已完成主壳体比例与节奏：
  - 一级分栏：`148 / 1488`
  - 二级分栏：`274 / 954 / 236`
  - 上下结构：`166 + 868`
- 已完成 `sideRail (t7NrN)` 的静态内容：标题、分组、菜单项、首页高亮、当前位置卡。
- 已完成 `headerLayer (sAmet)` 的 `topRow` 与 `pathBar`：
  - 左侧品牌标题保持单行
  - 中间说明区与右侧 meta 已接入真实静态内容
  - 阶段路径条已按 `01 预习 / 02 视频 / 03 互动 / 04 拓展` 建立

### 第 5-9 步：四张功能卡与统一联调
- 已完成左栏：
  - `previewCard`
  - `videoCard`
- 已完成右栏：
  - `interactionCard`
  - `extensionCard`
- 四张卡已进入统一联调后的当前版本：
  - 文案已统一为当前教学版本
  - 右上角图标均为局部内联 SVG
  - CTA 均为静态视觉内容，不包含真实点击逻辑
- 四张卡的摆位关系已经收口为当前版本：
  - 左侧为“上左下右”的错位节奏
  - 右侧为“上左偏、下归位”的对位节奏

### 第 10-15 步：中央舞台、对话入口、左右路径区与舞台绑定装饰
- 已完成 `questionBand`：
  - 当前主标题为 `同样的基因，为什么表现不同？`
- 已完成第 10A 及其 fixes：
  - `previewCard` 上方微型引导字
  - `interactionCard` 上方微型引导字
  - 右上 glow 的位置与强度修正
- 已完成 `centerArena` 主舞台：
  - 中央承托背景圆
  - Live2D 预留区
  - 双层底座与投影
  - 当前只保留 Live2D 预留舞台，不使用静态机器人替代
- 已完成 `dialogueEntry`：
  - 左侧引导文案
  - 右侧静态 CTA 按钮
  - 作为 `questionBand → centerArena → dialogueEntry` 的底部闭环入口
- 已完成 `leftSpacer` 与 `rightSpacer`：
  - 左右两侧双轨道路径区已收口为当前验收版本
  - `rightSpacer` 的核心几何明确以 `leftSpacer` 当前通过版为强模板
- 已完成 `centerArena` 周边直接绑定装饰：
  - 左上角紫色小球 + stem
  - 左下角黄色方块 + stem
  - 右下角 DNA 装饰
- 上述区域均由多轮 fix 收口到当前版本，当前文档只记录最终状态。

### 第 17 步：页面级分子纹理装饰
- 已完成两组页面级分子纹理：
  - `bioTextureTopLeft (WxkvD)`
  - `bioTextureBottomRight (WU72G)`
- 这两组纹理属于**页面级背景陪衬**，不是 `centerArena` 舞台绑定装饰的重复实现。
- `centerArena` 右下 DNA 仍归类为舞台绑定装饰，不属于第 17 步页面级 DNA 系统。

## 暂缓 / 未完成范围
- 第 16 步：Live2D 主体接入与运行时联动暂缓，当前页面仍只有舞台预留区。
- 首页当前仍是**静态展示页**，以下行为未实现：
  - `dialogueEntry` 的真实输入行为
  - CTA 按钮点击逻辑
  - 页面动画与 hover
  - 业务状态和数据联动
- 当前文档不负责区分“原始实现”和“后续人工调整”，只描述当前结果。

## 冻结边界
- 以下内容默认视为**已验收冻结**，后续不要轻易回改：
  - 页面总体尺寸与主壳体比例
  - 左侧学习导航结构
  - 顶部标题区与阶段路径条
  - 四张功能卡的内容、图标、CTA 与摆位关系
  - `questionBand`
  - `centerArena` 主舞台、Live2D 预留区与双层底座
  - `dialogueEntry`
  - `leftSpacer`
  - `rightSpacer`
  - `centerArena` 周边装饰
  - 页面级分子纹理装饰
- 当前语义边界也视为冻结：
  - `centerArena` 右下 DNA = 舞台绑定装饰
  - `bioTextureTopLeft / bioTextureBottomRight` = 页面级分子纹理
  - 第 16 步 = Live2D 接入，当前未开始

## 后续建议
- 第一优先级：执行第 16 步，在 `centerArenaReservedArea` 内接入真实 Live2D。
- 第二优先级：将 `V5StagePage.tsx` 继续拆分成更小的页面级子组件，降低单文件体量。
- 第三优先级：把局部 SVG 装饰、几何常量、节点坐标进一步抽离，减少 `V5StagePage.tsx` 中的硬编码密度。
- 第四优先级：补齐文档外的工程能力：
  - visual regression
  - 可访问性检查
  - 资源懒加载
  - 性能基线
- 第五优先级：如果后续继续做全页动态装饰，优先在当前冻结结果上做轻量联调，不要回到骨架和主舞台重新求解。
