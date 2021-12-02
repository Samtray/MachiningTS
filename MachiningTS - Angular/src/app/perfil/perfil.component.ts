import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { ApiService } from 'src/app/api.service';
import { getMatIconNameNotFoundError } from '@angular/material/icon';
import { takeUntil } from 'rxjs/operators';
import * as alt from 'alertifyjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit, OnDestroy {

  clicked = false;
  matcher = new MyErrorStateMatcher();
  eye = true;
  eye2 = true;
	perfil:any=[];
 
  usuario!: string;
  foto = "https://localhost:44304/img/anonymous.png" ;
  id!:string
  nombre!:string;
  rol!:string;
  totalMovimientos!: Number;
  ultimaModificacion!:string;
  ultimaSesion!:string;

  isAdmin = 'Null';
  currentUser!: string;
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();
  contraForm = this.fb.group({
    uno: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
    dos: ['', [Validators.required]]
  }, { validator: this.checkPasswords });

  @ViewChild('formDirective') private formDirective!: NgForm;
  
  constructor(private fb: FormBuilder, private authSvc: AuthService, private cd: ChangeDetectorRef, 
    private service: ApiService) {
  }


  ngOnInit(): void {
    // let local = JSON.parse(localStorage.getItem("user")!);
    // this.usuario = local.usuario;
    this.authSvc.currentUser.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>{
        this.currentUser = res;
        this.getInfo(this.currentUser);
      });
    this.authSvc.isAdmin$.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>(this.isAdmin = res))
  }

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }

  getInfo(usuario){
    this.subscriptions.add(this.service.getPerfil(usuario).subscribe(data=>{
        this.perfil=data;
        this.fillVariables();
      }));
  }

  fillVariables(){
    this.usuario = this.perfil[0].usuario;
    this.foto = this.perfil[0].foto;
    this.id = this.perfil[0].id;
    this.nombre = this.perfil[0].nombre;
    this.rol = this.perfil[0].rol;
    this.totalMovimientos = this.perfil[0].totalMovimientos;
    this.ultimaModificacion = this.perfil[0].ultimaModificacion;
    this.ultimaSesion = this.perfil[0].ultimaSesion;
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.uno.value;
    let confirmPass = group.controls.dos.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  
  cambiarContra(){
    if(this.contraForm.invalid){
      return;
    }
    const formValue = this.contraForm.value;

    alt.confirm("¿Estás seguro qué quieres cambiar tu contraseña? Se cerrará tu sesión.",
    ()=>{
      this.subscriptions.add(
      this.authSvc.changepwd(formValue).subscribe( (res: any) => {
      if(res){
        this.formDirective.resetForm();
        this.authSvc.logout('Contrasena');
      }
    })
    );
    // alt.success('Contraseña Modificada Exitosamente');
  },
  ()=>{
    alt.error('Operación Cancelada');
        this.formDirective.resetForm();
  }).set({title:"Confirmar cambio de Contraseña"}).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}});;
      
  }

  updateProfilePhoto(event: any){
    var file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('uploadedFile', file, file.name);
    this.subscriptions.add(this.service.deleteIMG(this.foto).subscribe());
    this.subscriptions.add(this.service.uploadIMG(formData).subscribe((data: any)=>{
      this.foto = data.toString();
      var val={
        id: this.id,
        foto: this.foto
      };
      this.editarFoto(val);
      //this.getInfo(this.usuario);
      //this.PhotoFilePath = this.service.Photos + this.PhotoFileName;
      }));
    // this.editarFoto(); 
  }

  editarFoto(val: any){
    this.subscriptions.add(this.service.updateIMGprf(val).subscribe());
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

  onImgError(event){
    event.target.src = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
   }


}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent!.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
