export type SourceType =
  | 'manual'
  | 'copied_session'
  | 'copied_template'
  | 'library'
  | 'ai_generated';

export type ExerciseMetricType = 'load_reps' | 'time';
export type WorkoutStatus = 'planned' | 'in_progress' | 'completed';

export type TemplateSetPlan = {
  id: string;
  order: number;
  targetKg?: number;
  targetReps?: number;
  targetDurationSec?: number;
  rpeTarget?: number;
  notes?: string;
};

export type WorkoutExerciseTemplate = {
  id: string;
  name: string;
  notes?: string;
  metricType: ExerciseMetricType;
  restPolicySec?: number;
  setPlans: TemplateSetPlan[];
};

export type WorkoutSectionTemplate = {
  id: string;
  name: string;
  notes?: string;
  order: number;
  exercises: WorkoutExerciseTemplate[];
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  notes?: string;
  sourceType: SourceType;
  version: number;
  tags: string[];
  equipmentNeeded: string[];
  isUnilateral: boolean;
  sections: WorkoutSectionTemplate[];
};

export type SessionSet = {
  id: string;
  order: number;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  actualKg?: number;
  actualReps?: number;
  actualRpe?: number;
  actualDurationSec?: number;
  restTakenSec?: number;
};

export type SessionExercise = {
  id: string;
  name: string;
  notes?: string;
  metricType: ExerciseMetricType;
  restPolicySec?: number;
  sets: SessionSet[];
};

export type SessionSection = {
  id: string;
  name: string;
  notes?: string;
  order: number;
  exercises: SessionExercise[];
};

export type WorkoutSession = {
  id: string;
  date: string;
  status: WorkoutStatus;
  sourceType: SourceType;
  templateId?: string;
  templateVersion?: number;
  nameSnapshot: string;
  notes?: string;
  sectionsSnapshot: SessionSection[];
  startedAt?: string;
  completedAt?: string;
};

export type DayWorkoutPlan = {
  date: string;
  templateId: string;
};

export type WorkoutStore = {
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  dayPlans: DayWorkoutPlan[];
};

export type DraftExercise = {
  id: string;
  name: string;
  metricType: ExerciseMetricType;
};

export type WorkoutEditorMode = 'none' | 'create' | 'copy';
