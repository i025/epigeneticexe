import type { NavigationTarget } from "../config/routeRegistry";

export type SideRailTone = "blue" | "amber" | "cyan" | "violet";
export type SideRailTarget = NavigationTarget;

export type SideRailLeaf = {
  label: string;
  target: SideRailTarget;
};

export type SideRailGroup = {
  title: string;
  tone: SideRailTone;
  items: SideRailLeaf[];
};

type SideRailContent = {
  title: string;
  subtitle: string;
  home: {
    label: string;
    target: SideRailTarget;
  };
  groups: SideRailGroup[];
  location: {
    title: string;
  };
};

export const sideRailContent = {
  title: "学习导航",
  subtitle: "点击左侧任意入口即可切换当前学习部分",
  home: {
    label: "首页",
    target: "home"
  },
  groups: [
    {
      title: "01 预习推文",
      tone: "blue",
      items: [{ label: "预习推文", target: "pre-study" }]
    },
    {
      title: "02 观看视频",
      tone: "amber",
      items: [{ label: "观看视频", target: "video" }]
    },
    {
      title: "03 互动探索",
      tone: "cyan",
      items: [
        { label: "知识图谱", target: "knowledge-graph" },
        { label: "岁月留痕", target: "methylation-mini" },
        { label: "镜像人生", target: "twin" },
        { label: "互动练习", target: "exercises" }
      ]
    },
    {
      title: "04 拓展阅读",
      tone: "violet",
      items: [
        { label: "CpG 岛案例", target: "cpg" },
        { label: "荷兰饥荒案例", target: "famine" }
      ]
    }
  ],
  location: {
    title: "当前位置"
  }
} satisfies SideRailContent;