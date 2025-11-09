import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/army-life/',  // GitHub Pages 的 repository 名稱
  build: {
    outDir: 'docs'  // GitHub Pages 使用 docs 資料夾
  }
})
