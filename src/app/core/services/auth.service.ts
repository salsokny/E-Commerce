import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage(),
  );

  public readonly user$ = this.userSubject.asObservable();

  public login(username: string, password: string): Observable<User> {
    // 1. Check business logic conditions first using standard if/else
    if (username === 'sokny' && password === '123456') {
      const customUser: User = {
        id: 'usr_sokny_777',
        username: 'sokny',
        email: 'sokny@example.com',
        name: 'Sokny',
      };

      const mockToken = 'mock_jwt_token_for_sokny_interview_validation';

      // 2. Use try/catch ONLY around operations that might throw a hardware or browser error
      try {
        this.setUserAndToken(customUser, mockToken);
        return of(customUser);
      } catch (browserError) {
        console.error('Browser Storage Error:', browserError);
        return throwError(
          () =>
            new Error(
              'Failed to save your session to this browser. Check storage permissions.',
            ),
        );
      }
    }
    return throwError(() => new Error('Invalid username or password'));
  }

  public logout(): void {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.warn(
        'LocalStorage access denied or unavailable during logout:',
        error,
      );
    } finally {
      this.userSubject.next(null);
    }
  }

  public getToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Failed to read token from localStorage safely:', error);

      return null;
    }
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setUserAndToken(user: User, token: string): void {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (error) {
      throw new Error(
        `Failed to save user session: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      this.userSubject.next(user);
    }
  }

  private getUserFromStorage(): User | null {
    try {
      const userString = localStorage.getItem('user');
      return userString ? (JSON.parse(userString) as User) : null;
    } catch (e) {
      throw new Error(
        `Failed to parse user data from local storage: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
}
