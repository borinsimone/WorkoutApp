import { useEffect } from 'react';
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
  useEffect(() => {
    if (mode !== 'copy') {
      return;
    }

    document.body.classList.add('workout-modal-open');

    return () => {
      document.body.classList.remove('workout-modal-open');
    };
  }, [mode]);

  if (mode !== 'copy') {
    return null;
  }

  const sourceTypeLabel: Record<string, string> = {
    manual: 'Creato da te',
    copied_session: 'Da storico sessioni',
    copied_template: 'Da template',
    library: 'Libreria iniziale',
    ai_generated: 'Generato da IA',
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => setMode('none')}
    >
      <div
        className={styles.modalSheet}
        role='dialog'
        aria-modal='true'
        aria-label='Copia allenamento'
        onClick={(event) => event.stopPropagation()}
      >
        <article className={styles.editorCard}>
          <div className={styles.modalHeader}>
            <h3 className={styles.cardTitle}>Copia allenamento</h3>
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={() => setMode('none')}
            >
              Chiudi
            </button>
          </div>

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
            <p className={styles.copyTitle}>
              Da template personali e libreria iniziale
            </p>
            {store.templates.map((template) => (
              <button
                key={template.id}
                type='button'
                className={styles.copyRow}
                onClick={() => copyFromTemplate(template)}
              >
                <span>{template.name}</span>
                <span>
                  {sourceTypeLabel[template.sourceType] ?? template.sourceType}
                </span>
              </button>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
