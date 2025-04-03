import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: 'WINDOW',
      useValue: {
        localStorage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      }
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);


