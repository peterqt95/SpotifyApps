import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { User } from '@app/models/User';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const flaskUrl = environment.flaskApi;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  flaskUrl = flaskUrl;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getLoginSession(userName: string) {
    const queryParams = '?name=' + userName;
    return this.http.get(this.flaskUrl + '/login' + queryParams);
  }

  public login(userName: string, password: string): Observable<User> {
    return this.http.post<User>(this.flaskUrl + '/login', {
      name: userName,
      password: password
    }).pipe(map((user: User) => {
      if (user && user.accessToken) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }

  public logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.currentUserSubject.next(null);
  }
}
