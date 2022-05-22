import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {

  constructor(private authSvc: AuthService){}


  canActivate(): Observable<boolean>  {
    return this.authSvc.isLogged.pipe(take(1),
      map(e => {
        if (e) {
        this.authSvc.redirect(); 
          return false;
        }else{
          // this.authSvc.redirect(); 
          // this.authSvc.logout('Error');
        return true;
      }
      }),
      catchError((err) => {
        // this.authSvc.redirect(); 
        // this.authSvc.logout('Error');
        return of(false);
      })
    );
  }   
  
}

