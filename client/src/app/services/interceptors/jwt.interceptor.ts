import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';
import { environment } from '@env/environment';

const flaskApi = environment.flaskApi;

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.loginService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.accessToken;
        const isApiUrl = request.url.startsWith(flaskApi);
        if (isLoggedIn && isApiUrl) {
            // Get token from local storage
            const token = currentUser.accessToken;
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });
        }

        return next.handle(request);
    }
}