import type { WorkoutState } from '../hooks/use-workout-state';
import styles from '../styles/page.module.scss';

type CopyWorkoutCardProps = Pick<
  WorkoutState,
  | 'mode'
  | 'historySessions'
  | 'store'
  | 'copyFromSession'
  | 'copyFromTemplate'
  | 'setMode'
>;

export function CopyWorkoutCard({
  mode,
  historySessions,
  store,
  copyFromSession,
  copyFromTemplate,
  setMode,
}: CopyWorkoutCardProps) {
  if (mode !== 'copy') {
    return null;
  }

  return (
    <article className={styles.editorCard}>
      <h3 className={styles.cardTitle}>Copia workout</h3>

      <div className={styles.copyBlock}>
        <p className={styles.copyTitle}>Da sessioni passate</p>
        {historySessions.length === 0 && (
          <p className={styles.copyEmpty}>Nessuna sessione completata.</p>
        )}
        {historySessions.map((session) => (
          <button
            key={session.id}
            type='button'
            className={styles.copyRow}
            onClick={() => copyFromSession(session)}
          >
            <span>{session.nameSnapshot}</span>
            <span>{session.date}</span>
          </button>
        ))}
      </div>

      <div className={styles.copyBlock}>
        <p className={styles.copyTitle}>Da template personali e libreria</p>
        {store.templates.map((template) => (
          <button
            key={template.id}
            type='button'
            className={styles.copyRow}
            onClick={() => copyFromTemplate(template)}
          >
            <span>{template.name}</span>
            <span>{template.sourceType}</span>
          </button>
        ))}
      </div>

      <button
        type='button'
        className={styles.secondaryButton}
        onClick={() => setMode('none')}
      >
        Chiudi
      </button>
    </article>
  );
}
