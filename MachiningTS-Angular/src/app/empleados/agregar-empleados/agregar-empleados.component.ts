import { Component, OnInit,Input, OnDestroy  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ApiService } from 'src/app/api.service';
import * as bcrypt from 'bcryptjs';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import * as alt from 'alertifyjs';

@Component({
  selector: 'app-agregar-empleados',
  templateUrl: './agregar-empleados.component.html',
  styleUrls: ['./agregar-empleados.component.css']
})
export class AgregarEmpleadosComponent implements OnInit, OnDestroy {
  constructor(private service:ApiService, private fb: FormBuilder, private authSvc: AuthService) { }

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

  currentUser!: string;
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();

  agregarForm = this.fb.group({
    nombre: ['', [Validators.required,Validators.maxLength(100)]],
    usuario: ['', [Validators.required,Validators.maxLength(100)]],
    rol: ['', [Validators.required]], });
  
  contraForm = this.fb.group({contrasena: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
  contrasena2: ['', [Validators.required]]
}, { validator: this.checkPasswords})

  ngOnInit(): void {
    this.refreshData();
    this.authSvc.currentUser.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>{
        this.currentUser = res;
      });
  }

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }

  refreshData(){
    this.id=this.empleado.id;
    this.nombre=this.empleado.nombre;
    this.usuario=this.empleado.usuario;
    this.contrasena=this.empleado.contrasena;
    this.foto=this.empleado.foto;
    this.rol=this.empleado.rol;
  }

  agregarEmpleado(){
    if(this.agregarForm.invalid ||this.contraForm.invalid){
      return;
    }

    let contra = bcrypt.hashSync(this.contraForm.get('contrasena')?.value, 10);

      var val={
        id: this.id,
			  nombre: this.agregarForm.get('nombre')?.value,
        usuario: this.agregarForm.get('usuario')?.value,
			  contrasena: contra,
			  foto: this.foto,
			  rol: this.agregarForm.get('rol')?.value,
      };
      // this.service.postEmpleado(val).subscribe(res=>{
      //   alert(res.toString());
      // });

      var val2={uno: this.currentUser, dos: this.agregarForm.get('usuario')?.value}
      this.subscriptions.add(this.service.postEmpleado(val).subscribe(res=>{
      if(res == "Se ha registrado con éxito."){
        alt.success(res);
        this.subscriptions.add(this.service.postNuevoEmpleadoHistorial(val2).subscribe());
      }else{
        alt.error(res);
      }
    }));
  
  }

  uploadProfilePhoto(event: any){
    var file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('uploadedFile', file, file.name);
    this.subscriptions.add(this.service.uploadIMG(formData).subscribe((data: any)=>{
      this.foto = data.toString();
      //this.PhotoFilePath = this.service.Photos + this.PhotoFileName;
      }));
  }

  getErrorMessage(field: string): string{
    let message;
    if (this.agregarForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.agregarForm.get(field)!.hasError('minlength')){
        const minLength = this.agregarForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.agregarForm.get(field)!.hasError('maxlength')){
        const maxLength = this.agregarForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`
    }else if (this.agregarForm.get(field)!.hasError('pattern')){
      message = `Solo valores numéricos.`
    }
    return message;
  }

  getErrorMessage2(field: string): string{
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

  

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.contrasena.value;
    let confirmPass = group.controls.contrasena2.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  isValidField(field: string): boolean{
    return ((this.agregarForm.get(field)?.touched! || this.agregarForm.get(field)?.dirty!)  && !this.agregarForm.get(field)?.valid);
   
  }
  isValidField2(field: string): boolean{
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