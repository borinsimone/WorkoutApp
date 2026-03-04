import styles from './styles/page.module.scss';

export default function CommunityPage() {
  return (
    <section
      className={styles.tabPage}
      aria-label='Comunità'
    >
      <h1 className={styles.tabTitle}>Comunità</h1>
      <p className={styles.tabSubtitle}>
        Feed, gruppi e attività della comunità.
      </p>

      <article className={styles.comingSoonCard}>
        <p className={styles.comingSoonBadge}>Prossimamente</p>
        <p className={styles.comingSoonText}>
          Qui troverai feed condiviso, gruppi tematici, sfide tra utenti e
          commenti sugli allenamenti.
        </p>
      </article>
    </section>
  );
}
