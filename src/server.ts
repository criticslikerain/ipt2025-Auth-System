import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { renderApplication } from '@angular/platform-server';
import bootstrap from './main.server';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ipt2025-auth-system/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) 
    ? 'index.original.html' 
    : 'index.html';

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

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

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './main.server';


