import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Workout App',
    short_name: 'Workout',
    description: 'Workout app',
    start_url: '/',
    display: 'standalone',
    background_color: '#1f2127',
    theme_color: '#1f2127',
    lang: 'it',
  };
}
