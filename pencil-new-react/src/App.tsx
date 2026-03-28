import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./App.module.css";
import { headerContent } from "./content/headerContent";
import {
  isRouteKey,
  routeGroupMap,
  routeRegistry,
  type NavigationTarget,
  type RouteKey
} from "./config/routeRegistry";
import { LearningSidebar } from "./components/LearningSidebar";
import { V5StagePage } from "./pages/V5StagePage";
import { resolveLocalFileUrl } from "./utils/resolveLocalFileUrl";

const HOME_HASH = "#/home";
const VIEW_HASH_PREFIX = "#/view/";
const HOME_SURFACE_WIDTH = 1548;
const HOME_SURFACE_HEIGHT = 1120;
const HOME_CHAT_URL =
  "https://www.xianjianaiedu.com/tech/CozeEmbed/?config=JTdCJTIydGl0bGUlMjIlM0ElMjIlRTglOTMlOUQlRTYlOTklQjYlRTUlOEQlOUElRTUlQTMlQUIlMjIlMkMlMjJzdWJ0aXRsZSUyMiUzQSUyMiVFOSU4MCU5QSVFNyU5NCVBOCVFNSVCMCU4RiVFNSU4QSVBOSVFNiU4OSU4QiUyMiUyQyUyMmRlc2NyaXB0aW9uJTIyJTNBJTIyJUU0JUJEJTlDJUU0JUI4JUJBJUUzJTgwJThBJUU3JTk0JTlGJUU1JTkxJUJEJUU3JTlBJTg0JUU1JThGJTk4JUU1JUE1JThGJUVGJUJDJTlBJUU4JUE3JUEzJUU3JUEwJTgxJUU4JUExJUE4JUU4JUE3JTgyJUU5JTgxJTk3JUU0JUJDJUEwJUUzJTgwJThCJUU1JUJFJUFFJUU4JUFGJUJFJUU2JTk5JUJBJUU4JTgzJUJEJUU0JUJEJTkzJUU1JUIwJThGJUU1JThBJUE5JUU2JTg5JThCJTIyJTJDJTIyYm90SWQlMjIlM0ElMjI3NjA3MDE0MTM2NjM1NDA4NDIyJTIyJTJDJTIyb2F1dGhBcHBJZCUyMiUzQSUyMjExNjI3Nzg5NjAzMzUlMjIlMkMlMjJvYXV0aEtpZCUyMiUzQSUyMkxGcjI5MnB5MFJ6eENabUp3SlU5WFk3d21KWS1UdHdTZXBKRHdXdjZZcTAlMjIlMkMlMjJvYXV0aFByaXZhdGVLZXklMjIlM0ElMjItLS0tLUJFR0lOJTIwUFJJVkFURSUyMEtFWS0tLS0tJTVDbk1JSUV2d0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktrd2dnU2xBZ0VBQW9JQkFRREQ0JTJCNmo3UnVBd3Z2aCU1Q25nRXV4elZkT20wQ3dRYVk3JTJCTXVaSjdWczlXWkJRVUhaRDhEN01tamFmT05wQ05PdU9XUiUyRlpwdXllOFloY0oyWCU1Q25BblBodzhTRDZQRDJ1ZkYwMEpaYmtWNDN3NGp3bWwxSGxCQWFSWjNtTGRPdTdMNWZnV3ZaZDJ3NDZRYlY5bGpTJTVDbjNsc2JuR0xWNFpHRm4ydW5mVkNmWG1mZ0s2cTlxYlU5UHJvYmxnQ3B3R3JOd2lYb0EyNENEUHFrTkhVVWtrZ0MlNUNudzFrMDRxZzVuaEZxTHAxMFNWOFEwaVpvNElIZEswUGVIZU1aJTJCMlJOdWRYdzI5YSUyRkx4bUdTcXdrZEd6cEkwRGIlNUNuMGJMUFduUzB0Zmx5WjAxRDZCdGRlT0JJcCUyRmhQbVVyMFQzczJLTU9ldDQwVUFBZVIlMkZsZjNwemNmazBDQW0zSnElNUNuOG5SY3E1cGZBZ01CQUFFQ2dnRUFUbHJ4Zld1ZCUyQlRMRk91MnRHWGxvQjE3TmtOTXBzY3B5Y2hneWwxdFBwQ0Y4JTVDbnU5enoxZWJUanpXdVp6aXJKNEQ0aElkZ0Z4UXdhJTJGYldhbTJHT2RPcld4SkZ0SU1ySkkwODMzSzF5N3R3bnNFNCU1Q25ONlh2alBxMHpyb2M5dGJteldBQTZsTTlIRVNGd2ZjUWo0UjIwQVFOZXIwSUR2bDJQJTJCQTk3QW1BcG1nQkcyeSUyRiU1Q25BcE5zJTJCUk54YzBZdzBXZXJCV0dYeHlzalp2eWRyMWdSQVJUbklwSjZRT1dRbTR0cm91aFc4cHNIRGFLcGJNT04lNUNuUmdKOCUyQlN0N1NFWk5HUTBGS2d4eG95Q05PN21NJTJCZnhwbzdmQWg3UW9INXRhaVlyMTAwSHl2ejhSa2xWRFZGUTYlNUNuaHFMQ3d2QmFhSSUyRnBpb2tOQTVUS1BQNzNhJTJGc0YlMkJxTVJtWm9lVyUyRkdWU1FLQmdRRDUzc0puTDdYaHRyY2w1NGdCJTVDbjVndUVoUDBWWDg5dnRqQjcwT3pEQTNOVEFKOEZHTFptM2JXT0pQdTZEJTJCdnc5U2FDU0tNbWFlRzBqMDklMkZPVjdPJTVDbmExY2swRWs2aWNSYkIlMkZmSE44R2ozQ3doOVdGbkROZHY3eTVPT0JGRlN3Wm83SUdMYlp5QVdsU0hVZFluQiUyQmEyJTVDbklNQzZSVXolMkZLTW8lMkJRT2FtMTNaUTdwbGJPUUtCZ1FESXNpcm5JUG9IVzhRUWZJb0hYViUyQkp2VUNLeXV1WUR0YSUyRiU1Q25OYnNRcmFDdUhEbEh3Q05JOSUyRjFIN2h1N29maDFBSHRLWCUyRkVpblZzUlRLMzl1REg4bk83ZE9WblgzZVdMVXZXayU1Q25JVEgxREJFVTlUdFRqNkhVWkxDYUpMZlJIaEx4SHNScmVGN0c4cUZ0TzB0ZEwzME51TG9KUnNoUHolMkJUdkVwTDQlNUNuUkVPclZRaHFWd0tCZ1FEbzRZWDhtQW9EZ2NEMjhmRGdIQ0VWOU1EUVlBaTh6R2dwcmhKTXUzV0xvYU9VSTNFMSU1Q25OR1FYUkQ3ZExpT3Y0enh0NXZjd1FUVGNqVWtCZ1Yzc016ejRFYXglMkJnNUpmYVhDMDJ6Rjk0Q0c5MEs1a1ZpS2clNUNucjZKUHdvJTJGT0xsdWVCUGZFRkhmdFpNTXRqOGR4ZnpxMiUyQnBYRnhmczZRVEVsam1XcWtGdzBsJTJGeVVlUUtCZ1FDeCU1Q25YR3IzMlRlODJ3Y1pQc1pJbmViNWRldWMlMkZKbFp4dnRXJTJGYWYwcEV5VXNkS1pLeDdEdEl6OFRWdnE1TWdLdGtNJTJCJTVDbnhpejIxek1NeGNRWnJmZFc5R1ZQMGdnbzhpdVNoZDBaa0ZCeTY1Z0klMkJuUFVjJTJCR2pMdHkzVEcyNSUyQjZibnViWUIlNUNuOTkxaVdqZjRyV2I3MGlUa3hIUjhFRGFqJTJCZWlxc3JKNWZ2S0NibUpDZndLQmdRQ3BLSkhRYlk2cnBvdzZZOTd6JTVDbnBsM3JKbFYlMkJzTWVzYjlrc1NRcElTNVQyQzlHc3lFVlp5S2ZqQ1ByakR2VVdvaUpNa0tDZHN2WXZMSVlOSkdrSSU1Q25FSWtuT21iOFo1REtudWc1Y1hPcFV2VHEwZFdRZWIwN1RDUzZ3JTJGdkVwUHYyVWYybkFORkdINzBocVolMkZGVXBIZSU1Q25obUxGJTJGWlBmd0RCVHcyeURvSjdtSjFCMyUyQlElM0QlM0QlNUNuLS0tLS1FTkQlMjBQUklWQVRFJTIwS0VZLS0tLS0lMjIlMkMlMjJjaGF0VGl0bGUlMjIlM0ElMjIlRTglOTMlOUQlRTYlOTklQjYlRTUlOEQlOUElRTUlQTMlQUIlMjIlN0Q=";
const HOME_LOCATION_LINES = ["首页", "主入口", "表观遗传"];

type AppRoute =
  | {
      mode: "home";
    }
  | {
      mode: "view";
      routeKey: RouteKey;
    };

type HomeHotspot = {
  id: string;
  title: string;
  description: string;
  routeKey?: RouteKey;
  action?: "chat";
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

const homeHotspots = [
  {
    id: "preview-card",
    title: "预习推文",
    description: "打开预习推文页面",
    routeKey: "pre-study",
    rect: { x: 30, y: 242, width: 236, height: 244 }
  },
  {
    id: "video-card",
    title: "观看视频",
    description: "打开视频学习页面",
    routeKey: "video",
    rect: { x: 72, y: 837, width: 236, height: 244 }
  },
  {
    id: "interaction-card",
    title: "互动探索",
    description: "打开互动探索分组",
    routeKey: "knowledge-graph",
    rect: { x: 1229, y: 242, width: 236, height: 244 }
  },
  {
    id: "extension-card",
    title: "拓展阅读",
    description: "打开拓展阅读分组",
    routeKey: "cpg",
    rect: { x: 1282, y: 829, width: 236, height: 244 }
  },
  {
    id: "dialogue-entry",
    title: "进入对话",
    description: "打开智能助手对话面板",
    action: "chat",
    rect: { x: 483, y: 995, width: 620, height: 89 }
  }
] satisfies HomeHotspot[];

function parseAppRoute(hash: string): AppRoute | null {
  const normalizedHash = hash.trim();

  if (!normalizedHash || normalizedHash === "#" || normalizedHash === HOME_HASH) {
    return { mode: "home" };
  }

  if (!normalizedHash.startsWith(VIEW_HASH_PREFIX)) {
    return null;
  }

  const routeKey = normalizedHash.slice(VIEW_HASH_PREFIX.length);

  if (!isRouteKey(routeKey)) {
    return null;
  }

  return {
    mode: "view",
    routeKey
  };
}

function navigateToHash(nextHash: string) {
  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash;
  }
}

function useHashRoute() {
  const [route, setRoute] = useState<AppRoute>(
    () => parseAppRoute(window.location.hash) ?? { mode: "home" }
  );

  useEffect(() => {
    const syncRoute = () => {
      const nextRoute = parseAppRoute(window.location.hash);

      if (nextRoute) {
        setRoute(nextRoute);
        return;
      }

      setRoute({ mode: "home" });
      navigateToHash(HOME_HASH);
    };

    if (!window.location.hash) {
      navigateToHash(HOME_HASH);
    }

    syncRoute();
    window.addEventListener("hashchange", syncRoute);

    return () => {
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  return route;
}

function useStageScale() {
  const [measureElement, setMeasureElement] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!measureElement) {
      return;
    }

    const updateScale = () => {
      const rect = measureElement.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const nextScale = Math.min(
        rect.width / HOME_SURFACE_WIDTH,
        rect.height / HOME_SURFACE_HEIGHT,
        1
      );
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(measureElement);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [measureElement]);

  return { measureRef: setMeasureElement, scale };
}

function getLocationLines(route: AppRoute) {
  if (route.mode === "home") {
    return HOME_LOCATION_LINES;
  }

  const activeRoute = routeRegistry[route.routeKey];
  const activeGroup = routeGroupMap[activeRoute.group];
  return [activeGroup.label, activeRoute.label, "同壳承接"];
}

type ViewerContentProps = {
  routeKey: RouteKey;
  onGoHome: () => void;
  onOpenRoute: (routeKey: RouteKey) => void;
};

function ViewerContent({ routeKey, onGoHome, onOpenRoute }: ViewerContentProps) {
  const activeRoute = routeRegistry[routeKey];
  const activeGroup = routeGroupMap[activeRoute.group];
  const viewerSrc = resolveLocalFileUrl(activeRoute.filePath);
  const isArticleRoute = activeRoute.contentKind === "article";
  const viewerThemeClassName =
    isArticleRoute && activeRoute.readerTheme === "extension"
      ? styles.viewerThemeExtension
      : isArticleRoute
        ? styles.viewerThemePreview
        : "";
  const viewerMainClassName = `${styles.shellMain} ${styles.viewerMain}${
    isArticleRoute ? ` ${styles.viewerMainArticle}` : ""
  }${viewerThemeClassName ? ` ${viewerThemeClassName}` : ""}`;
  const viewerHeaderClassName = `${styles.viewerHeader}${
    isArticleRoute ? ` ${styles.viewerHeaderArticle}` : ""
  }`;
  const viewerFrameWrapClassName = `${styles.viewerFrameWrap}${
    isArticleRoute ? ` ${styles.viewerFrameWrapArticle}` : ""
  }`;
  const viewerFrameClassName = `${styles.viewerFrame}${
    isArticleRoute ? ` ${styles.viewerFrameArticle}` : ""
  }`;
  const viewerMetaText = isArticleRoute
    ? `${headerContent.brandTitle} · 统一阅读壳`
    : `${headerContent.brandTitle} · 学习页面壳层`;

  return (
    <div className={viewerMainClassName}>
      <header className={viewerHeaderClassName}>
        <div className={styles.viewerHeaderMain}>
          <button type="button" className={styles.viewerBackButton} onClick={onGoHome}>
            返回首页
          </button>

          <div className={styles.viewerHeading}>
            <p className={styles.viewerKicker}>{activeGroup.label}</p>
            <h1 className={styles.viewerTitle}>{activeRoute.label}</h1>
            <p className={styles.viewerMeta}>{viewerMetaText}</p>
          </div>
        </div>

        <div className={styles.viewerSwitchArea}>
          <span className={styles.viewerSwitchLabel}>{activeGroup.viewerLabel}</span>
          <div className={styles.viewerSwitchList}>
            {activeGroup.routeKeys.map((groupRouteKey) => {
              const route = routeRegistry[groupRouteKey];
              const isActive = groupRouteKey === routeKey;
              const className = isActive
                ? `${styles.viewerSwitchButton} ${styles.viewerSwitchButtonActive}`
                : styles.viewerSwitchButton;

              return (
                <button
                  key={route.key}
                  type="button"
                  className={className}
                  onClick={() => onOpenRoute(groupRouteKey)}
                >
                  {route.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className={viewerFrameWrapClassName}>
        <iframe
          key={routeKey}
          className={viewerFrameClassName}
          src={viewerSrc}
          title={`${activeRoute.label} 页面内容`}
        />
      </div>
    </div>
  );
}

function HomeChatDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const panelClassName = expanded
    ? `${styles.homeChatPanel} ${styles.homeChatPanelOpen} ${styles.homeChatPanelExpanded}`
    : `${styles.homeChatPanel} ${styles.homeChatPanelOpen}`;

  return (
    <>
      <button
        type="button"
        className={styles.homeChatOverlay}
        aria-label="关闭聊天面板"
        onClick={onClose}
      />

      <aside className={panelClassName} aria-hidden={false}>
        <header className={styles.homeChatHeader}>
          <div>
            <p className={styles.homeChatKicker}>互动助手</p>
            <h2 className={styles.homeChatTitle}>蓝晶博士</h2>
          </div>

          <div className={styles.homeChatActions}>
            <button
              type="button"
              className={styles.homeChatActionButton}
              aria-label="切换大窗口"
              onClick={() => setExpanded((current) => !current)}
            >
              &#x2922;
            </button>
            <button
              type="button"
              className={styles.homeChatCloseButton}
              aria-label="关闭聊天面板"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        </header>

        <div className={styles.homeChatBody}>
          <iframe
            className={styles.homeChatFrame}
            src={HOME_CHAT_URL}
            title="蓝晶博士聊天面板"
            loading="lazy"
            allow="clipboard-write; microphone"
          />
        </div>
      </aside>
    </>
  );
}

type HomeContentProps = {
  scale: number;
  measureRef: (node: HTMLDivElement | null) => void;
  onOpenRoute: (routeKey: RouteKey) => void;
  onOpenDialogue: () => void;
};

function HomeContent({ scale, measureRef, onOpenRoute, onOpenDialogue }: HomeContentProps) {
  return (
    <div className={`${styles.shellMain} ${styles.homeMain}`}>
      <div className={styles.homeStageMeasure} ref={measureRef}>
        <div
          className={styles.homeStageBounds}
          style={{
            width: `${HOME_SURFACE_WIDTH * scale}px`,
            height: `${HOME_SURFACE_HEIGHT * scale}px`
          }}
        >
          <div
            className={styles.homeStageInner}
            style={{
              width: `${HOME_SURFACE_WIDTH}px`,
              height: `${HOME_SURFACE_HEIGHT}px`,
              zoom: scale
            }}
          >
            <V5StagePage />

            <div className={styles.homeHotspotLayer}>
              {homeHotspots.map((hotspot) => {
                const hotspotStyle: CSSProperties = {
                  left: `${hotspot.rect.x}px`,
                  top: `${hotspot.rect.y}px`,
                  width: `${hotspot.rect.width}px`,
                  height: `${hotspot.rect.height}px`
                };

                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    className={styles.homeHotspot}
                    style={hotspotStyle}
                    aria-label={`${hotspot.title}：${hotspot.description}`}
                    title={hotspot.description}
                    onClick={() => {
                      if (hotspot.action === "chat") {
                        onOpenDialogue();
                        return;
                      }

                      if (hotspot.routeKey) {
                        onOpenRoute(hotspot.routeKey);
                      }
                    }}
                  >
                    <span className={styles.srOnly}>{hotspot.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type AppShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <section className={styles.shell}>
      <div className={styles.shellSidebar}>{sidebar}</div>
      {children}
    </section>
  );
}

export default function App() {
  const route = useHashRoute();
  const { measureRef, scale } = useStageScale();
  const [isHomeChatOpen, setIsHomeChatOpen] = useState(false);

  const openRoute = (routeKey: RouteKey) => {
    navigateToHash(`${VIEW_HASH_PREFIX}${routeKey}`);
  };

  const openTarget = (target: NavigationTarget) => {
    if (target === "home") {
      navigateToHash(HOME_HASH);
      return;
    }

    openRoute(target);
  };

  const goHome = () => {
    navigateToHash(HOME_HASH);
  };

  const openHomeChat = () => {
    setIsHomeChatOpen(true);
  };

  const closeHomeChat = () => {
    setIsHomeChatOpen(false);
  };

  useEffect(() => {
    if (route.mode !== "home") {
      setIsHomeChatOpen(false);
    }
  }, [route]);

  const activeTarget = route.mode === "home" ? "home" : route.routeKey;
  const locationLines = getLocationLines(route);

  return (
    <div className={styles.app}>
      <AppShell
        sidebar={
          <LearningSidebar
            activeTarget={activeTarget}
            locationLines={locationLines}
            onNavigate={openTarget}
          />
        }
      >
        {route.mode === "view" ? (
          <ViewerContent routeKey={route.routeKey} onGoHome={goHome} onOpenRoute={openRoute} />
        ) : (
          <HomeContent
            measureRef={measureRef}
            scale={scale}
            onOpenRoute={openRoute}
            onOpenDialogue={openHomeChat}
          />
        )}
      </AppShell>

      <HomeChatDialog open={isHomeChatOpen} onClose={closeHomeChat} />
    </div>
  );
}
