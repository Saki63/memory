import { defineConfig } from 'vite';

export default defineConfig({
  base: "/memory/",
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        settings: 'settings.html',
        board: 'board.html',
      }
    }
  }
});