import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from '../login.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status >= 400 && err.status < 600) {
                // Logout if error status of 401
                this.loginService.logout();
                // location.reload(true);
                window.location.href = "http://localhost:4200/login";
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}