import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function uploadPhotoPlugin(): Plugin {
  return {
    name: 'upload-photo-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-photo', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { filename, base64 } = JSON.parse(body);
              if (!filename || !base64) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing filename or base64' }));
                return;
              }
              const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(cleanBase64, 'base64');
              
              const safeFilename = path.basename(filename);
              const p1 = path.join(__dirname, 'assets/fotos', safeFilename);
              const p2 = path.join(__dirname, 'public/assets/fotos', safeFilename);
              
              fs.mkdirSync(path.dirname(p1), { recursive: true });
              fs.mkdirSync(path.dirname(p2), { recursive: true });
              
              fs.writeFileSync(p1, buffer);
              fs.writeFileSync(p2, buffer);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, path: `assets/fotos/${safeFilename}` }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    
    plugins: [react(), tailwindcss(), uploadPhotoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});