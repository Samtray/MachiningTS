import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit, OnDestroy {

  notis: any[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(private apiService: ApiService, private authSvc: AuthService) { }

  ngOnInit(): void {
    this.authSvc.notificationsUser.pipe(
      takeUntil(this.destroy$))
    .subscribe(res=>{this.notis = res;})
  }

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
  }
}
