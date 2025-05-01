import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { renderApplication } from '@angular/platform-server';
import bootstrap from './src/main.server';

// Comment out or remove any code that clears localStorage
// const mockLocalStorage: Storage = {
//   length: 0,
//   clear: () => {},
//   getItem: () => null,
//   key: () => null,
//   removeItem: () => {},
//   setItem: () => {},
//   [Symbol.iterator]: function* () { yield* []; }
// };

// (global as any).localStorage = mockLocalStorage;
// (global as any).window = { localStorage: mockLocalStorage };

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ipt2025-auth-system/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) 
    ? 'index.original.html' 
    : 'index.html';

  // Serve static files with proper MIME types
  server.use(express.static(distFolder, {
    maxAge: '1y',
    fallthrough: true
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    renderApplication(bootstrap, {
      document: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      platformProviders: [
        { provide: APP_BASE_HREF, useValue: baseUrl }
      ]
    }).then(html => {
      res.send(html);
    }).catch(err => {
      console.error('Error:', err);
      next(err);
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}


declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
