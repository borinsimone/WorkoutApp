// In-memory data store for workouts
export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  duration: number; // in minutes
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number; // in kg
}

// In-memory storage
let workouts: Workout[] = [
  {
    id: '1',
    name: 'Upper Body Workout',
    date: new Date().toISOString(),
    duration: 45,
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10, weight: 60 },
      { name: 'Shoulder Press', sets: 3, reps: 12, weight: 20 },
      { name: 'Pull-ups', sets: 3, reps: 8 },
    ],
  },
  {
    id: '2',
    name: 'Leg Day',
    date: new Date(Date.now() - 86400000).toISOString(),
    duration: 60,
    exercises: [
      { name: 'Squats', sets: 4, reps: 8, weight: 100 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 150 },
      { name: 'Lunges', sets: 3, reps: 10 },
    ],
  },
];

export function getAllWorkouts(): Workout[] {
  return workouts;
}

export function getWorkoutById(id: string): Workout | undefined {
  return workouts.find((workout) => workout.id === id);
}

export function createWorkout(workout: Omit<Workout, 'id'>): Workout {
  const newWorkout = {
    ...workout,
    id: Date.now().toString(),
  };
  workouts.push(newWorkout);
  return newWorkout;
}

export function deleteWorkout(id: string): boolean {
  const index = workouts.findIndex((workout) => workout.id === id);
  if (index !== -1) {
    workouts.splice(index, 1);
    return true;
  }
  return false;
}
