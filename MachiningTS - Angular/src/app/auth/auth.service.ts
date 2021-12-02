import { HostListener, Injectable } from '@angular/core';
import {environment} from '../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { CambiarContra, Contra, Roles, User, UserResponse } from '../models/user.interface';
import {catchError, map} from 'rxjs/operators'
import {JwtHelperService} from '@auth0/angular-jwt'
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import * as alt from 'alertifyjs';
import { IdleService } from './idle.service';
import { ApiService } from '../api.service';
import { SpinnerService } from './spinner.service';
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); 
  private user = new BehaviorSubject<string>(''); 
  private role = new BehaviorSubject<Roles>('Null');
  private notis = new BehaviorSubject<any[]>([]);
  itemSent = new BehaviorSubject<any>(null);
  itemSentValid = new BehaviorSubject<boolean>(false);
  userActivity: any;
  userInactive: Subject<any> = new Subject();
  // notis: any=[]; 
  perfil: any=[];
  //private con!: string;
  constructor(private http:HttpClient, private router: Router, private idleService: IdleService, private apiService: ApiService, private spnService: SpinnerService) { 
    this.checkToken();
    idleService.idle$.subscribe(() => {
      this.logout('Idle');
    });
  
    // idleService.wake$.subscribe(s => this.loggedIn.next(true));
  }

 
  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  get isAdmin$ ():Observable<string>{

    return this.role.asObservable();
  }

  get currentUser ():Observable<string>{
    return this.user.asObservable();
  }

  get notificationsUser():Observable<any[]>{
    return this.notis.asObservable();
  }

  get itemSvc():Observable<any>{
    return this.itemSent.asObservable();
  }
  get itemValid():Observable<boolean>{
    return this.itemSentValid.asObservable();
  }

  contra(authData:User):Observable<Contra | void>{
    authData.check = false;
    return this.http.post<Contra>(`${environment.API_URL}/cuenta/contra`, authData).pipe(
      map( (resc:Contra) =>
      {
        //this.con = resc.contrasena;
        if (bcrypt.compareSync(authData.contrasena, resc.contrasena)){
          authData.check = true
        }
        return resc;
      }),
      catchError((err) => this.handlerError(err))
    );
  }

  changepwd(authData:CambiarContra):Observable<CambiarContra | void>{
    // let local = JSON.parse(localStorage.getItem("user")!);
    authData.uno = this.user.getValue();
    authData.dos = bcrypt.hashSync(authData.dos, 10);
    return this.http.post<CambiarContra>(`${environment.API_URL}/cuenta/cambiarcontrasena`, authData).pipe(
      map( (res:CambiarContra) =>
      {
        alt.success('Se ha actualizado su contraseña.')
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }

  changepwd2(authData:CambiarContra):Observable<CambiarContra | void>{
    // let local = JSON.parse(localStorage.getItem("user")!);
    authData.dos = bcrypt.hashSync(authData.dos, 10);
    return this.http.post<CambiarContra>(`${environment.API_URL}/cuenta/cambiarcontrasena`, authData).pipe(
      map( (res:CambiarContra) =>
      {
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }


  login(authData:User):Observable<UserResponse | void>{
    return this.http.post<UserResponse>(`${environment.API_URL}/cuenta/login`, authData).pipe(
      map( (res) =>
      {
            this.saveToken(res);
            this.loggedIn.next(true);
            this.user.next(res.usuario);
            this.role.next(res.rol);
            // this.updateSession(res.usuario)
            this.notifications();
            this.updateSession(res.usuario).subscribe(data=>{

              })
            this.historialLogin(res.usuario).subscribe(data=>{
                })
            
            return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }


  notifications(){
    this.apiService.getNewNotifcations().subscribe(res2 =>{
      this.notis.next(res2); 
      setTimeout(() => {
            if(this.notis.getValue().length > 0)
            alt.warning('Tienes ' + this.notis.getValue().length.toString() + ' alerta(s).')
            else{
            alt.warning('No hay alertas nuevas.')
            }}, 5000);
    });
  }

  notifications2(){
    this.apiService.getNewNotifcations().subscribe(res2 =>{
      this.notis.next(res2); 
    });
  }

  updateSession(val:any){
    return this.http.put(`${environment.API_URL}/cuenta/datetime?user=`+val, val);
  }

  historialLogin(val:any){
    return this.http.post(`${environment.API_URL}/historial/logins?his=`+val, val);
  }

  logout(type: String):void{
    localStorage.removeItem("user");
    const check = this.loggedIn.getValue();
    if(type == 'Normal'){
      alt.warning('Se ha cerrado su sesión.');
    }else if(check && type == 'Idle') {
      alt.error('Se ha cerrado su sesión por inactividad.');
    }else if(type == 'Error') {
      alt.error('Por favor inicie sesión.');
    }
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  redirect(){
    this.router.navigate(['resumen']);
    alt.error('No tienes acceso a esta ruta.');
  }
  
  private checkToken():void{
    const user = JSON.parse(localStorage.getItem("user")!);
     if(user){
      const isExpired = helper.isTokenExpired(user);
      if(isExpired){
        this.logout('Normal');
      }else{
        const refresh = helper.decodeToken(user);
        this.loggedIn.next(true);
        // this.role.next('Empleado');
        this.apiService.getPerfil(refresh.unique_name).subscribe(data=>{
          this.perfil=data;
          this.user.next(this.perfil[0].usuario)
          this.role.next(this.perfil[0].rol);
        this.notifications();
      });
      }     
     }
  }
  
adminApi(): Observable<boolean> {
  const user = JSON.parse(localStorage.getItem("user")!);
  const refresh = helper.decodeToken(user);
    return this.http.get<any>(`${environment.API_URL}/empleados/` + refresh.unique_name).pipe(map(res=> {
      if (res[0].rol == "Admin") {
        return true;
      }
      return false;
    }));
  }

  private saveToken(user: UserResponse):void{
    const rest = user.accessToken;
    localStorage.setItem('user', JSON.stringify(rest))
  }

  private handlerError(err:any):Observable<never>{
    let errorMessage = 'An error occurred retrieving data.';
    if (err){
      errorMessage = `Nombre de usuario o contraseña incorrectos.`;
    }
    alt.error(errorMessage)
    this.spnService.hide();
    return throwError(errorMessage);
  }

  uploadPhoto(val:any){
    return this.http.post(environment.API_URL +'/fotos', val)
  }

}
