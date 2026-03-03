import styles from './styles/page.module.scss';

export default function CommunityPage() {
  return (
    <section
      className={styles.tabPage}
      aria-label='Community'
    >
      <h1 className={styles.tabTitle}>Community</h1>
      <p className={styles.tabSubtitle}>
        Feed, gruppi e attività della tua community.
      </p>
    </section>
  );
}
