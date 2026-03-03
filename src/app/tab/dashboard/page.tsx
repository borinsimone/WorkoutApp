import styles from './styles/page.module.scss';

export default function DashboardPage() {
  return (
    <section
      className={styles.tabPage}
      aria-label='Panoramica'
    >
      <h1 className={styles.tabTitle}>Panoramica</h1>
      <p className={styles.tabSubtitle}>
        Panoramica rapida delle metriche e progressi.
      </p>

      <article className={styles.comingSoonCard}>
        <p className={styles.comingSoonBadge}>Prossimamente</p>
        <p className={styles.comingSoonText}>
          Qui troverai grafici di performance, andamento settimanale e insight
          su volume, costanza e PR.
        </p>
      </article>
    </section>
  );
}
