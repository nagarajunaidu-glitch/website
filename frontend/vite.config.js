import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

// Helper to find all HTML files for multi-page build
function getHtmlEntries() {
  const entries = {
    main: resolve(__dirname, 'index.html'),
    '404': resolve(__dirname, '404.html'),
  };

  const dirs = fs.readdirSync(__dirname, { withFileTypes: true });
  for (const dir of dirs) {
    if (dir.isDirectory() && !['node_modules', 'dist', 'assets', 'css', 'js'].includes(dir.name)) {
      const htmlPath = resolve(__dirname, dir.name, 'index.html');
      if (fs.existsSync(htmlPath)) {
        entries[dir.name] = htmlPath;
      }
    }
  }
  return entries;
}

// Plugin to copy raw static directories & SEO files into dist
function copyStaticPlugin() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const dist = resolve(__dirname, 'dist');
      ['css', 'js', 'assets'].forEach(dir => {
        const srcDir = resolve(__dirname, dir);
        const destDir = resolve(dist, dir);
        if (fs.existsSync(srcDir)) {
          fs.cpSync(srcDir, destDir, { recursive: true });
        }
      });
      ['robots.txt', 'sitemap.xml'].forEach(file => {
        const srcFile = resolve(__dirname, file);
        const destFile = resolve(dist, file);
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, destFile);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [copyStaticPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: getHtmlEntries()
    }
  }
});
