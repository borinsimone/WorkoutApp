import { toDateKey } from '../lib/date';
import type { WorkoutState } from '../hooks/use-workout-state';
import styles from '../styles/page.module.scss';

type WeeklyNavigatorProps = Pick<
  WorkoutState,
  'store' | 'selectedDate' | 'setSelectedDate' | 'weekDays' | 'moveWeek' | 'weekdayLabels'
>;

export function WeeklyNavigator({
  store,
  selectedDate,
  setSelectedDate,
  weekDays,
  moveWeek,
  weekdayLabels,
}: WeeklyNavigatorProps) {
  return (
    <article className={styles.weekCard}>
      <div className={styles.weekTopBar}>
        <button
          type='button'
          className={styles.weekSwitch}
          onClick={() => moveWeek(-7)}
        >
          ← Settimana prec.
        </button>
        <p className={styles.weekRangeLabel}>
          {weekDays[0].toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'short',
          })}{' '}
          -{' '}
          {weekDays[6].toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'short',
          })}
        </p>
        <button
          type='button'
          className={styles.weekSwitch}
          onClick={() => moveWeek(7)}
        >
          Settimana succ. →
        </button>
      </div>

      <div className={styles.weekGrid}>
        {weekDays.map((day, index) => {
          const dayKey = toDateKey(day);
          const dayPlan = store.dayPlans.find((item) => item.date === dayKey);
          const daySession = store.sessions.find((item) => item.date === dayKey);

          const statusClass =
            daySession?.status === 'completed'
              ? styles.statusCompleted
              : daySession?.status === 'in_progress'
                ? styles.statusInProgress
                : dayPlan
                  ? styles.statusPlanned
                  : styles.statusNone;

          return (
            <button
              key={dayKey}
              type='button'
              className={`${styles.dayCell} ${statusClass} ${
                dayKey === selectedDate ? styles.daySelected : ''
              }`}
              onClick={() => setSelectedDate(dayKey)}
            >
              <span className={styles.dayName}>{weekdayLabels[index]}</span>
              <span className={styles.dayNumber}>{day.getDate()}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
