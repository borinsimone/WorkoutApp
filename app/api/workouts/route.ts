import { NextRequest, NextResponse } from 'next/server';
import { getAllWorkouts, createWorkout } from '@/lib/workouts';

export async function GET() {
  try {
    const workouts = getAllWorkouts();
    return NextResponse.json(workouts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.exercises || !Array.isArray(body.exercises)) {
      return NextResponse.json(
        { error: 'Invalid workout data' },
        { status: 400 }
      );
    }

    const workout = createWorkout({
      name: body.name,
      exercises: body.exercises,
      date: body.date || new Date().toISOString(),
      duration: body.duration || 0,
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}
