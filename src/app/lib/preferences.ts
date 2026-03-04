export const WORKOUT_PREP_SECONDS_KEY = 'workout-prep-seconds';
export const DEFAULT_WORKOUT_PREP_SECONDS = 5;

export const getWorkoutPrepSeconds = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_WORKOUT_PREP_SECONDS;
  }

  const raw = window.localStorage.getItem(WORKOUT_PREP_SECONDS_KEY);
  if (!raw) {
    return DEFAULT_WORKOUT_PREP_SECONDS;
  }

  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return DEFAULT_WORKOUT_PREP_SECONDS;
  }

  return Math.min(30, Math.max(0, Math.floor(value)));
};

export const setWorkoutPrepSeconds = (seconds: number) => {
  if (typeof window === 'undefined') {
    return;
  }

  const safeValue = Math.min(30, Math.max(0, Math.floor(seconds)));
  window.localStorage.setItem(WORKOUT_PREP_SECONDS_KEY, String(safeValue));
};
