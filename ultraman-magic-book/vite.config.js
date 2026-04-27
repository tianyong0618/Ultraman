import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-cname',
      buildEnd: () => {
        const cnamePath = path.resolve(__dirname, 'CNAME')
        const distPath = path.resolve(__dirname, 'dist', 'CNAME')
        
        if (fs.existsSync(cnamePath)) {
          fs.copyFileSync(cnamePath, distPath)
          console.log('CNAME file copied to dist directory')
        }
      }
    }
  ],
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.test.jsx'],
    hookTimeout: 1000,
    testTimeout: 5000,
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    include: ['src/**/*.{js,jsx}'],
  },
})
