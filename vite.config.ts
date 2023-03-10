import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, normalizePath } from 'vite';
import viteEslint from 'vite-plugin-eslint';

// 全局 less 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(resolve('./src/styles/variable.less'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteEslint({
      exclude: ['**/*.spec.ts']
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        // additionalData 的内容会在每个 less 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
