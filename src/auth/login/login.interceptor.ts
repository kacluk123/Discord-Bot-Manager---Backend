
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookiesService, RequestWithCookie } from '../../cookies/cookies.service'
@Injectable()
export class CookieInterceptor implements NestInterceptor {
  constructor(private cookiesService: CookiesService) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<RequestWithCookie>();
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe( 
      tap(() => {
        const cookies = req._cookies;
        if (cookies.length) {
          this.cookiesService.setCookies(res, cookies)
        }
      }),
    );
  }
}