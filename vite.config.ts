import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
/** 平台的名称、版本、运行所需的`node`版本、依赖、构建时间的类型提示 */
import { name, version, dependencies, devDependencies } from './package.json'

const __APP_INFO__ = {
  pkg: { name, version, dependencies, devDependencies },
  buildTimestamp: Date.now()
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    host: true,
    port: 5174
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: false
  },
  define: {
    __APP_INFO__: JSON.stringify(__APP_INFO__)
  }
})
