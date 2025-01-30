import { defineConfig } from '@tanstack/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    preset: 'vercel',
    prerender: {
      routes: ['/docs'],
      crawlLinks: true,
      ignore: [
        // Ignore dynamic API routes
        '/api/**',
      ],
    }
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})