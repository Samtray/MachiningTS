import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs'
// import * as bcrypt from 'bcryptjs';
import * as alt from 'alertifyjs';
// import {User} from './../../models/user.interface';
// import { ApiService } from 'src/app/api.service';
import { takeUntil } from 'rxjs/operators';
import { SpinnerService } from '../spinner.service';
// import { max } from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  eye = true;
  private subscription: Subscription = new Subscription();
  clicked = false;
  notis: any=[]; 
  loginForm = this.fb.group({
    usuario:['', Validators.required,],
    contrasena: ['', [Validators.required,Validators.minLength(8), Validators.maxLength(16)]],
  })
  // userLocal!:any;
  currentUser!: string;
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();

  images: string[] = ['../../../assets/1.jpg','../../../assets/2.jpg','../../../assets/3.jpg','../../../assets/4.jpg'];

  backgroundImage: string = '';
  constructor(
    private authSvc: AuthService, 
    private fb: FormBuilder, 
    private router: Router,
    private spnService: SpinnerService) { }


  ngOnInit(): void {
    let ran = (Math.random() * ((this.images.length-1) - 0 + 1) ) << 0
    this.backgroundImage = this.images[ran];
  }

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }

  onLogin():void{
    if(this.loginForm.invalid){
      return;
    }
    this.spnService.show();
    const formValue = this.loginForm.value;
      this.subscription.add(
      this.authSvc.contra(formValue).subscribe( res => {
      if(res){
        this.next();
      }
    })
    );
    }

  next(){
    const formValue = this.loginForm.value;
    this.subscription.add(
      this.subscriptions.add(
        this.authSvc.login(formValue).subscribe(res2 =>{
        if(res2){
          // this.userLocal = JSON.parse(localStorage.getItem("user")!);
          this.authSvc.currentUser.pipe(
            takeUntil(this.destroy$))
            .subscribe(res=>{
              this.currentUser = res;
            });
          this.spnService.hide();    
          this.router.navigate(['resumen']);
          alt.success('Bienvenido ' + this.currentUser);
        }
    })));
  }

  getErrorMessage(field: string): string{
    let message;
    if (this.loginForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.loginForm.get(field)!.hasError('minlength')){
        const minLength = this.loginForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.loginForm.get(field)!.hasError('maxlength')){
        const maxLength = this.loginForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`

    }
    return message;
  }
  isValidField(field: string): boolean{
    return ((this.loginForm.get(field)!.touched || this.loginForm.get(field)!.dirty)  && !this.loginForm.get(field)?.valid); 
   }

  // isValidField(field: string): boolean{
  //   return !this.loginForm.get(field)?.valid;
   
  // }

  // if(this.loginForm.get(field)?.errors?.hasError('')){
  //   message = 'Debes ingresar un valor.'
  // }else if (this.loginForm.get(field)?.hasError('pattern')){
  //   message = 'Este error no deberia salir :D'
  // }else if(this.loginForm.get(field)?.hasError('minlength')){
  //   const minLength = this.loginForm.get(field)?.errors?.minlength.requiredLength;
  //   message = `Este campo debe tener al menos ${minLength}  carácteres.`

  disableBtn(element){
    // element.textContent = text;
    element.disabled = true;
    setTimeout(() => {
      element.disabled = false;
      }, 5000);
  }

}
