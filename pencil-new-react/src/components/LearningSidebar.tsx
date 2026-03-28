import {
  sideRailContent,
  type SideRailTarget,
  type SideRailTone
} from "../content/sideRailContent";
import styles from "./LearningSidebar.module.css";

export type LearningSidebarProps = {
  activeTarget: SideRailTarget;
  locationLines: string[];
  onNavigate: (target: SideRailTarget) => void;
};

function toneClassName(tone: SideRailTone) {
  return {
    blue: styles.groupBlue,
    amber: styles.groupAmber,
    cyan: styles.groupCyan,
    violet: styles.groupViolet
  }[tone];
}

export function LearningSidebar({
  activeTarget,
  locationLines,
  onNavigate
}: LearningSidebarProps) {
  return (
    <aside className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{sideRailContent.title}</h1>
        <p className={styles.subtitle}>{sideRailContent.subtitle}</p>
      </div>

      <div className={styles.menu}>
        <button
          type="button"
          className={`${styles.buttonReset} ${styles.homeButton} ${
            activeTarget === sideRailContent.home.target ? styles.homeButtonCurrent : ""
          }`}
          aria-current={activeTarget === sideRailContent.home.target ? "page" : undefined}
          onClick={() => onNavigate(sideRailContent.home.target)}
        >
          <span className={styles.currentDot} aria-hidden="true" />
          <span className={styles.homeLabel}>{sideRailContent.home.label}</span>
        </button>

        {sideRailContent.groups.map((group) => (
          <section key={group.title} className={`${styles.group} ${toneClassName(group.tone)}`}>
            <h2 className={styles.groupTitle}>{group.title}</h2>

            <div className={styles.groupItems}>
              {group.items.map((item) => {
                const isCurrent = activeTarget === item.target;

                return (
                  <button
                    key={item.target}
                    type="button"
                    className={`${styles.buttonReset} ${styles.groupButton} ${
                      isCurrent ? styles.groupButtonCurrent : ""
                    }`}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => onNavigate(item.target)}
                  >
                    <span className={styles.groupDot} aria-hidden="true" />
                    <span className={styles.groupLabel}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className={styles.locationCard}>
        <h2 className={styles.locationTitle}>{sideRailContent.location.title}</h2>
        <p className={styles.locationDescription}>{locationLines.join("\n")}</p>
      </div>
    </aside>
  );
}