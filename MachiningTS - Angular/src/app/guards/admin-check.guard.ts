import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminCheckGuard implements CanActivate {
  
  constructor(private authSvc: AuthService){}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {


    return this.authSvc.adminApi().pipe(
      tap(allowed => {
        if (!allowed) this.authSvc.redirect(); 
      })
    );
  }

  
}
