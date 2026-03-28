export type PathStepTone = "current" | "amber" | "cyan" | "violet";

export type PathStep = {
  label: string;
  tone: PathStepTone;
  current?: boolean;
};

export const headerContent = {
  brandTitle: "生命的变奏——解码表观遗传",
  explanationText: "从问题出发，沿着建议路径进入预习、视频、互动与拓展的学习舞台。",
  metaText: "首页 / 主入口 / 表观遗传",
  pathBarLabel: "建议学习路径",
  pathSteps: [
    {
      label: "01 预习",
      tone: "current",
      current: true
    },
    {
      label: "02 视频",
      tone: "amber"
    },
    {
      label: "03 互动",
      tone: "cyan"
    },
    {
      label: "04 拓展",
      tone: "violet"
    }
  ] satisfies PathStep[]
};
