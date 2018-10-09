import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpCacheService } from './@services/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheservice: HttpCacheService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[Caching] Intercepted');

    if (req.urlWithParams.indexOf('/Token') < 0) {
      const cachedResponse = this.cacheservice[req.urlWithParams] || null;

      if (cachedResponse) {
        console.log('[Caching] Response from Cache');
        return of(cachedResponse);
      }
    }
    return next.handle(req).pipe(
      tap(event => {
        if (
          event instanceof HttpResponse &&
          req.urlWithParams.indexOf('/Token') < 0
        ) {
          this.cacheservice[req.urlWithParams] = event;
          console.log('[Caching] Response from server');
        }
      })
    );
  }
}
