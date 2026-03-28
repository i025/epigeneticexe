export type RouteGroup = "guide" | "video" | "interactive" | "extension";
export type ContentKind = "legacy" | "article";
export type ReaderTheme = "preview" | "extension";

type RouteSeed = {
  key: string;
  group: RouteGroup;
  label: string;
  shortLabel: string;
  filePath: string;
  contentKind?: ContentKind;
  readerTheme?: ReaderTheme;
  defaultChildKeys?: string[];
};

export const routeRegistry = {
  "pre-study": {
    key: "pre-study",
    group: "guide",
    label: "预习推文",
    shortLabel: "预习",
    filePath: "../../content/articles/pre-study/index.html",
    contentKind: "article",
    readerTheme: "preview",
    defaultChildKeys: ["pre-study"]
  },
  video: {
    key: "video",
    group: "video",
    label: "观看视频",
    shortLabel: "视频",
    filePath: "../../content/video/video.html",
    contentKind: "legacy",
    defaultChildKeys: ["video"]
  },
  "knowledge-graph": {
    key: "knowledge-graph",
    group: "interactive",
    label: "甲基化知识图谱",
    shortLabel: "知识图谱",
    filePath: "../../pages/knowledge-graph/index.html",
    contentKind: "legacy",
    defaultChildKeys: ["knowledge-graph", "methylation-mini", "twin", "exercises"]
  },
  "methylation-mini": {
    key: "methylation-mini",
    group: "interactive",
    label: "DNA甲基化模拟",
    shortLabel: "甲基化模拟",
    filePath: "../../pages/methylation-mini/index.html",
    contentKind: "legacy",
    defaultChildKeys: ["methylation-mini"]
  },
  twin: {
    key: "twin",
    group: "interactive",
    label: "双生子案例推演",
    shortLabel: "双生子",
    filePath: "../../pages/twin/index.html",
    contentKind: "legacy",
    defaultChildKeys: ["twin"]
  },
  exercises: {
    key: "exercises",
    group: "interactive",
    label: "互动练习",
    shortLabel: "练习",
    filePath: "../../pages/exercises/index.html",
    contentKind: "legacy",
    defaultChildKeys: ["exercises"]
  },
  cpg: {
    key: "cpg",
    group: "extension",
    label: "CpG 岛案例",
    shortLabel: "CpG 岛",
    filePath: "../../content/articles/cpg/index.html",
    contentKind: "article",
    readerTheme: "extension",
    defaultChildKeys: ["cpg", "famine"]
  },
  famine: {
    key: "famine",
    group: "extension",
    label: "饥荒与表观遗传",
    shortLabel: "饥荒案例",
    filePath: "../../content/articles/famine/index.html",
    contentKind: "article",
    readerTheme: "extension",
    defaultChildKeys: ["famine"]
  }
} as const satisfies Record<string, RouteSeed>;

export type RouteKey = keyof typeof routeRegistry;
export type RouteSpec = (typeof routeRegistry)[RouteKey];
export type NavigationTarget = "home" | RouteKey;

export type RouteGroupSpec = {
  key: RouteGroup;
  label: string;
  viewerLabel: string;
  defaultRouteKey: RouteKey;
  routeKeys: RouteKey[];
};

export const routeGroups: RouteGroupSpec[] = [
  {
    key: "guide",
    label: "01 预习推文",
    viewerLabel: "预习分组",
    defaultRouteKey: "pre-study",
    routeKeys: ["pre-study"]
  },
  {
    key: "video",
    label: "02 观看视频",
    viewerLabel: "视频分组",
    defaultRouteKey: "video",
    routeKeys: ["video"]
  },
  {
    key: "interactive",
    label: "03 互动探索",
    viewerLabel: "互动分组",
    defaultRouteKey: "knowledge-graph",
    routeKeys: ["knowledge-graph", "methylation-mini", "twin", "exercises"]
  },
  {
    key: "extension",
    label: "04 拓展阅读",
    viewerLabel: "拓展分组",
    defaultRouteKey: "cpg",
    routeKeys: ["cpg", "famine"]
  }
];

export const routeGroupMap = routeGroups.reduce((map, group) => {
  map[group.key] = group;
  return map;
}, {} as Record<RouteGroup, RouteGroupSpec>);

export function isRouteKey(value: string): value is RouteKey {
  return value in routeRegistry;
}
