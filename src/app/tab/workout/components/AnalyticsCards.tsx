import type { WorkoutState } from '../hooks/use-workout-state';
import styles from '../styles/page.module.scss';

type AnalyticsCardsProps = Pick<
  WorkoutState,
  'historySessions' | 'setSelectedDate' | 'prRows' | 'deleteCompletedSession'
>;

export function AnalyticsCards({
  historySessions,
  setSelectedDate,
  prRows,
  deleteCompletedSession,
}: AnalyticsCardsProps) {
  return (
    <>
      <article className={styles.analyticsCard}>
        <h3 className={styles.cardTitle}>Storico recente</h3>
        <div className={styles.copyBlock}>
          {historySessions.length === 0 && (
            <p className={styles.copyEmpty}>
              Ancora nessuna sessione completata.
            </p>
          )}
          {historySessions.map((session) => (
            <div
              key={session.id}
              className={styles.historyRow}
            >
              <button
                type='button'
                className={styles.copyRow}
                onClick={() => setSelectedDate(session.date)}
              >
                <span>{session.nameSnapshot}</span>
                <span>{session.date}</span>
              </button>
              <button
                type='button'
                className={styles.dangerButtonCompact}
                onClick={() => {
                  const shouldDelete = window.confirm(
                    'Eliminare questo allenamento completato dallo storico?',
                  );

                  if (shouldDelete) {
                    deleteCompletedSession(session.id);
                  }
                }}
              >
                Elimina
              </button>
            </div>
          ))}
        </div>
      </article>

      <article className={styles.analyticsCard}>
        <h3 className={styles.cardTitle}>Record personali</h3>
        <div className={styles.badgeList}>
          {prRows.length === 0 && (
            <span className={styles.badge}>Nessun PR ancora</span>
          )}
          {prRows.map((row) => (
            <span
              key={row.label}
              className={styles.badge}
            >
              {row.label}: {row.value}
            </span>
          ))}
        </div>
      </article>
    </>
  );
}
