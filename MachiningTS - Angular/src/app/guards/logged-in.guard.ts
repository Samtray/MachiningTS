import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private authSvc: AuthService){}

  // canActivate(): Observable<boolean> {
  //   return this.authSvc.isLogged.pipe(
  //     take(1), map((isLogged: boolean)=> isLogged)
  //   );
  // }

  canActivate(): Observable<boolean>  {
    return this.authSvc.isLogged.pipe(take(1),
      map(e => {
        if (e) {
          return true;
        }else{
        this.authSvc.logout('Error');
        return false;
      }
      }),
      catchError((err) => {
        // this.authSvc.logout('Error');
        return of(false);
      })
    );
  }
  
}