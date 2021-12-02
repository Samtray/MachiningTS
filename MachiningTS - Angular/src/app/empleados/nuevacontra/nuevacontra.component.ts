import { Component, OnInit,Input, OnDestroy  } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import * as alt from 'alertifyjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nuevacontra',
  templateUrl: './nuevacontra.component.html',
  styleUrls: ['./nuevacontra.component.css']
})
export class NuevacontraComponent implements OnInit, OnDestroy {

  constructor(private authSvc: AuthService, private fb: FormBuilder) { }
  @Input() empleado:any; 
  id!:number;
  nombre!:string;
  usuario!: string;
  contrasena!: string;
  contrasena2!:string;
  foto!:string;
  rol!: string;
  ultimaSesion!:string;
  totalMovimientos!:string;
  ultimaModificacion!:string;

  matcher = new MyErrorStateMatcher();
  eye = true;
  eye2 = true;
	perfil:any=[];

  private subscriptions: Subscription = new Subscription(); 

  contraForm = this.fb.group({
    uno: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
    dos: ['', [Validators.required]]
  }, { validator: this.checkPasswords });
  
  ngOnInit(): void {
    this.refreshData();
  }
  refreshData(){
    this.id=this.empleado.id;
    this.nombre=this.empleado.nombre;
    this.usuario=this.empleado.usuario;
    this.contrasena=this.empleado.contrasena;
    this.foto=this.empleado.foto;
    this.rol=this.empleado.rol;
  }

  ngOnDestroy(): void{
    this.subscriptions.unsubscribe();
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.uno.value;
    let confirmPass = group.controls.dos.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  editarContra(){
    if(this.contraForm.invalid){
      return;
    }
    var val={
      uno: this.usuario,
      dos: this.contraForm.get('dos')?.value,
    };
    this.subscriptions.add(this.authSvc.changepwd2(val).subscribe( (res: any) => {
        if(res=="Contraseña Modificada Exitosamente."){
          alt.success(res);
        }else{
          alt.error(res);
        }
      }));
  }

  getErrorMessage(field: string): string{
    let message;
    if (this.contraForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.contraForm.get(field)!.hasError('minlength')){
        const minLength = this.contraForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.contraForm.get(field)!.hasError('maxlength')){
        const maxLength = this.contraForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`
    }else if (this.contraForm.get(field)!.hasError('pattern')){
      message = `Solo valores numéricos.`
    }
    return message;
  }

  isValidField(field: string): boolean{
    return ((this.contraForm.get(field)?.touched! || this.contraForm.get(field)?.dirty!)  && !this.contraForm.get(field)?.valid);
   
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent!.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
