import {
  BaseUrl,
  IDecodedToken,
  IForgetPassword,
  IResetPassword,
  IUserSignUp,
  IVerifyResetCode,
  JsonBaseUrl,
} from '../Interfaces/IAuthentication';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { GoogleAuthProvider, signInWithPopup, Auth, getAuth } from 'firebase/auth';
import { app } from '../../../app/firebase.config';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private auth: Auth = getAuth(app);
  UserData = signal<IDecodedToken | null>(null);
  private readonly request = inject(HttpClient);

  SignUp(data: Partial<IUserSignUp>): Observable<any> {
    return this.request.post(`${JsonBaseUrl}/Users`, data);
  }

  SignIn(): Observable<IUserSignUp[]> {
    return this.request.get<IUserSignUp[]>(`${JsonBaseUrl}/Users`);
  }

  SaveUserData() {
    if (localStorage.getItem('Token') != null) {
      this.UserData.set(jwtDecode(localStorage.getItem('Token')!));
    }
  }

  getUserById(id: string): Observable<IUserSignUp> {
    return this.request.get<IUserSignUp>(`${JsonBaseUrl}/Users/${id}`);
  }

  logout(): void {
    localStorage.removeItem('Id');
    localStorage.removeItem('email');
    localStorage.removeItem('Token');
    this.UserData.set(null);
  }

  VerifyEmail(data: Partial<IForgetPassword>): Observable<any> {
    return this.request.post(`${BaseUrl}/api/v1/auth/forgotPasswords`, data);
  }

  ResetCode(data: Partial<IVerifyResetCode>): Observable<any> {
    return this.request.post(`${BaseUrl}/api/v1/auth/verifyResetCode`, data);
  }

  ResetPassword(data: Partial<IResetPassword>): Observable<any> {
    return this.request.put(`${BaseUrl}/api/v1/auth/resetPassword`, data);
  }

  getUserById(id: string): Observable<IUserSignUp> {
    return this.request.get<IUserSignUp>(`${JsonBaseUrl}/Users/${id}`);
  }

  logout(): void {
    localStorage.removeItem('Id');
    localStorage.removeItem('email');
    localStorage.removeItem('Token');
    this.UserData.set(null);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
}
