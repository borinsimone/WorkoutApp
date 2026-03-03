import styles from './styles/page.module.scss';

export default function DashboardPage() {
  return (
    <section
      className={styles.tabPage}
      aria-label='Dashboard'
    >
      <h1 className={styles.tabTitle}>Dashboard</h1>
      <p className={styles.tabSubtitle}>
        Panoramica rapida delle metriche e progressi.
      </p>
    </section>
  );
}
