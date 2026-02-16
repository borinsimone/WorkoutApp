import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              💪 WorkoutApp
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Track your fitness journey with ease
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">🏋️</div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                Log Workouts
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Record your exercises, sets, reps, and weights
              </p>
              <Link
                href="/workouts/new"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Create Workout
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                View History
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Browse and manage your workout history
              </p>
              <Link
                href="/workouts"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                View Workouts
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Features
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Create and manage workouts with multiple exercises</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Track sets, reps, and weights for each exercise</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>View workout history and statistics</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Backend API integration for data management</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
