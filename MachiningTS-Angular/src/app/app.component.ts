import { Component,OnDestroy, OnInit,} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service'
import { takeUntil } from 'rxjs/operators';
import { Router} from '@angular/router';
import * as alt from 'alertifyjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Machininventory';
  isAdmin = 'Null';
  isLogged = false;
  notis: any=[];
  hidden = false;
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();

  // this.subscriptions.add(

  constructor(private authSvc: AuthService, private router: Router) { 
   } 

  ngOnInit(){
    this.authSvc.isLogged.pipe(
      takeUntil(this.destroy$))
      .subscribe((res)=>(this.isLogged = res))

    this.authSvc.isAdmin$.pipe(
      takeUntil(this.destroy$))
    .subscribe(res=>{this.isAdmin = res;})

    this.authSvc.notificationsUser.pipe(
      takeUntil(this.destroy$))
    .subscribe(res=>{this.notis = res;})

    alt.defaults.theme.ok = "font-change-size btn btn-success";
    alt.defaults.theme.cancel = "font-change-size btn btn-danger";

  }

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }
  
  getNotiLength(){
    let not = this.notis.length
    if (not > 0){this.hidden = false }
    else{ this.hidden = true}
    return not;
  }

  refreshNotifications(){
    this.authSvc.notifications2();
  }

  onLogout(): void{
    this.authSvc.logout('Normal');
  }

  passItem(item:any){
    this.authSvc.itemSentValid.next(true);     
    this.authSvc.itemSent.next(item);     
    this.router.navigate(['inventario']);
  }



}

export class ExpansionOverviewExample {
  panelOpenState = false;

}
