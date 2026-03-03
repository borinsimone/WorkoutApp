import styles from './styles/page.module.scss';

export default function WorkoutPage() {
  return (
    <section
      className={styles.tabPage}
      aria-label='Workout'
    >
      <h1 className={styles.tabTitle}>Workout</h1>
      <p className={styles.tabSubtitle}>
        Sessioni, piani e storico degli allenamenti.
      </p>
    </section>
  );
}
