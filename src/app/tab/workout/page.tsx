'use client';

import { useWorkoutState } from './hooks/use-workout-state';
import { AnalyticsCards } from './components/AnalyticsCards';
import { CopyWorkoutCard } from './components/CopyWorkoutCard';
import { CreateWorkoutCard } from './components/CreateWorkoutCard';
import { DayStateCard } from './components/DayStateCard';
import { WeeklyNavigator } from './components/WeeklyNavigator';
import styles from './styles/page.module.scss';

export default function WorkoutPage() {
  const state = useWorkoutState();

  return (
    <section
      className={styles.tabPage}
      aria-label='Workout'
    >
      <h1 className={styles.tabTitle}>Workout</h1>

      <WeeklyNavigator {...state} />
      <DayStateCard {...state} />
      <CreateWorkoutCard {...state} />
      <CopyWorkoutCard {...state} />
      <AnalyticsCards {...state} />
    </section>
  );
}
