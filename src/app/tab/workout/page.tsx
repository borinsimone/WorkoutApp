'use client';

import { useEffect, useRef, useState } from 'react';
import { useWorkoutState } from './hooks/use-workout-state';
import { AnalyticsCards } from './components/AnalyticsCards';
import { CopyWorkoutCard } from './components/CopyWorkoutCard';
import { CreateWorkoutCard } from './components/CreateWorkoutCard';
import { DayStateCard } from './components/DayStateCard';
import { WeeklyNavigator } from './components/WeeklyNavigator';
import { WorkoutAssistantPage } from './components/WorkoutAssistantPage';
import type { WorkoutSession } from './types';
import styles from './styles/page.module.scss';

export default function WorkoutPage() {
  const state = useWorkoutState();
  const isAssistantOpen =
    state.assistantVisible && state.selectedSession?.status === 'in_progress';
  const [lastDeletedSession, setLastDeletedSession] =
    useState<WorkoutSession | null>(null);
  const undoTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAssistantOpen) {
      document.body.classList.add('workout-assistant-open');
    } else {
      document.body.classList.remove('workout-assistant-open');
    }

    return () => {
      document.body.classList.remove('workout-assistant-open');
    };
  }, [isAssistantOpen]);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current !== null) {
        window.clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const handleDeleteCompletedSession = (sessionId: string) => {
    const completedSession = state.store.sessions.find(
      (session) => session.id === sessionId && session.status === 'completed',
    );

    if (!completedSession) {
      return;
    }

    if (undoTimeoutRef.current !== null) {
      window.clearTimeout(undoTimeoutRef.current);
    }

    state.deleteCompletedSession(sessionId);
    setLastDeletedSession(completedSession);

    undoTimeoutRef.current = window.setTimeout(() => {
      setLastDeletedSession(null);
      undoTimeoutRef.current = null;
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (!lastDeletedSession) {
      return;
    }

    if (undoTimeoutRef.current !== null) {
      window.clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    state.restoreDeletedSession(lastDeletedSession);
    setLastDeletedSession(null);
  };

  if (isAssistantOpen) {
    return (
      <WorkoutAssistantPage
        {...state}
        closeAssistant={() => state.setAssistantVisible(false)}
      />
    );
  }

  return (
    <section
      className={styles.tabPage}
      aria-label='Allenamenti'
    >
      <h1 className={styles.tabTitle}>Allenamenti</h1>

      <WeeklyNavigator {...state} />
      <DayStateCard
        {...state}
        deleteCompletedSession={handleDeleteCompletedSession}
        openAssistant={() => state.setAssistantVisible(true)}
      />
      <CreateWorkoutCard {...state} />
      <CopyWorkoutCard {...state} />
      <AnalyticsCards
        {...state}
        deleteCompletedSession={handleDeleteCompletedSession}
      />

      {lastDeletedSession && (
        <div className={styles.undoToast}>
          <span className={styles.undoToastText}>Allenamento eliminato</span>
          <button
            type='button'
            className={styles.undoToastButton}
            onClick={handleUndoDelete}
          >
            Annulla
          </button>
        </div>
      )}
    </section>
  );
}
