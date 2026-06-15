import { defineConfig } from 'vite';

export default defineConfig({
  // 使用相对路径，确保 GitHub Pages 上资源正确加载
  // 无论是 https://<user>.github.io/<repo>/ 还是自定义域名都能正常工作
  base: './',
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
    hmr: {
      overlay: true,
      path: '/hot/vite-hmr',
      port: 6000,
      clientPort: 443,
      timeout: 30000,
    },
    watch: {
      usePolling: true,
      interval: 100,
    }
  },
});
