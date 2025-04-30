import {ApplicationConfig,provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthRepository, AuthRepositoryImpl} from './features/auth/AuthRepository';
import {jwtInterceptor} from './JwtInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    {provide: AuthRepository, useClass: AuthRepositoryImpl},
  ]
};


