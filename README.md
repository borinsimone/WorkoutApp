# WorkoutApp 💪

A modern workout tracking application built with Next.js and TypeScript, featuring full backend integration for managing your fitness journey.

![Homepage](https://github.com/user-attachments/assets/c5cf26fb-6bc2-4a84-bca6-afb5e759af6f)

## Features

- ✅ **Create Workouts**: Log your workouts with multiple exercises
- ✅ **Track Details**: Record sets, reps, and weights for each exercise
- ✅ **View History**: Browse and manage your workout history
- ✅ **Backend Integration**: RESTful API for data management
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile
- ✅ **Dark Mode Support**: Automatic theme switching

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Data Storage**: In-memory storage (easily replaceable with a database)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/borinsimone/WorkoutApp.git
cd WorkoutApp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
WorkoutApp/
├── app/                      # Next.js App Router
│   ├── api/                  # Backend API routes
│   │   └── workouts/         # Workout endpoints
│   │       ├── route.ts      # GET all, POST new workout
│   │       └── [id]/         # Dynamic routes
│   │           └── route.ts  # GET by ID, DELETE workout
│   ├── workouts/             # Frontend pages
│   │   ├── page.tsx          # Workouts list page
│   │   └── new/              
│   │       └── page.tsx      # Create workout page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── lib/                      # Shared utilities
│   └── workouts.ts           # Data management logic
└── public/                   # Static assets
```

## API Endpoints

### GET /api/workouts
Returns all workouts.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Upper Body Workout",
    "date": "2026-02-16T...",
    "duration": 45,
    "exercises": [
      {
        "name": "Bench Press",
        "sets": 3,
        "reps": 10,
        "weight": 60
      }
    ]
  }
]
```

### POST /api/workouts
Creates a new workout.

**Request Body:**
```json
{
  "name": "Leg Day",
  "duration": 60,
  "exercises": [
    {
      "name": "Squats",
      "sets": 4,
      "reps": 8,
      "weight": 100
    }
  ]
}
```

### GET /api/workouts/[id]
Returns a specific workout by ID.

### DELETE /api/workouts/[id]
Deletes a workout by ID.

## Screenshots

### Homepage
![Homepage](https://github.com/user-attachments/assets/c5cf26fb-6bc2-4a84-bca6-afb5e759af6f)

### Workouts List
![Workouts List](https://github.com/user-attachments/assets/2addf9ab-ec10-485d-92d6-1d3c18d2beb1)

### Create New Workout
![Create Workout](https://github.com/user-attachments/assets/dc3f0965-781c-4982-a585-969ef8325e89)

### After Creating a Workout
![After Creating](https://github.com/user-attachments/assets/03328d4b-50c1-4c7f-909c-d74358c9e558)

## Development

### Run Linter
```bash
npm run lint
```

### Build
```bash
npm run build
```

## Future Enhancements

- Add database integration (PostgreSQL, MongoDB, etc.)
- User authentication and authorization
- Workout templates and workout plans
- Progress tracking and statistics
- Exercise library with descriptions and videos
- Social features (share workouts, follow friends)
- Mobile app (React Native)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.