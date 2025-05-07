// refresh.interceptor.ts
import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpEvent
} from '@angular/common/http';
import {from, throwError, Observable, of} from 'rxjs';
import {catchError, switchMap, finalize, shareReplay, filter, take} from 'rxjs/operators';
import {AuthService} from './features/auth/services/AuthService';
import {TokenStorageService} from './features/auth/services/TokenStorageService';
import {Router} from '@angular/router';

let refreshInFlight$: Observable<void> | null = null;

export const refreshInterceptor: HttpInterceptorFn =
  (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    console.log(req.url)
    if (req.url.endsWith('/auth/refresh')
      || req.url.endsWith('/auth/login')
      || req.url.endsWith('/password-recovery/confirm')
      || req.url.endsWith('/password-recovery/request')
    ) {
      console.log(`${req.url} is skipped`)
      return next(req)
    }
    const tokenStorage = inject(TokenStorageService);
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
      catchError(err => {
        if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
          return throwError(() => err);
        }
        if (!refreshInFlight$) {
          refreshInFlight$ = from(authService.refreshToken()).pipe(
            finalize(() => refreshInFlight$ = null),
            shareReplay(1)
          );
        }


        return refreshInFlight$.pipe(
          switchMap(() => {
            return next(req);
          }),
          catchError(refreshErr => {
            tokenStorage.clearAll();
            void router.navigate(['/sign-in']);
            return throwError(() => refreshErr);
          })
        );
      })
    );
  };
