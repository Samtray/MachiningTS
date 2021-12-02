import { Component, OnInit,Input, OnDestroy  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import * as alt from 'alertifyjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-editar-empleado',
  templateUrl: './editar-empleado.component.html',
  styleUrls: ['./editar-empleado.component.css']
})
export class EditarEmpleadoComponent implements OnInit, OnDestroy{

  constructor(private fb: FormBuilder,private service:ApiService, private authSvc:AuthService) { }
  @Input() empleado2:any; 
  
  id!:number;
  nombre!:string;
  usuario!: string;
  foto!:string;
  rol!: string;
  ultimaSesion!:string;
  totalMovimientos!:string;
  ultimaModificacion!:string;

  currentUser!: string;
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();

  editarForm = this.fb.group({
    nombre: ['', [Validators.required,Validators.maxLength(100)]],
    rol: ['', [Validators.required]],
  })

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
    this.editarForm.get('nombre')!.setValue(this.empleado2.nombre);
    this.editarForm.get('rol')!.setValue(this.empleado2.rol);

    this.id=this.empleado2.id;
    this.nombre=this.empleado2.nombre;
    this.usuario=this.empleado2.usuario;
    this.foto=this.empleado2.foto;
    this.rol=this.empleado2.rol;
  }

  editarEmpleado(){
    if(this.editarForm.invalid){
      return;
    }
      var val={
        id: this.id,
			  nombre: this.editarForm.get('nombre')?.value,
        usuario: this.usuario,
			  foto: this.foto,
			  rol: this.editarForm.get('rol')?.value
      };

      var val2={uno: this.currentUser, dos: this.usuario}
      this.subscriptions.add(this.service.putEmpleado(val).subscribe(res=>{
      if(res == "Modificación exitosa."){
        alt.success(res);
        this.subscriptions.add(this.service.postEditarEmpleadoHistorial(val2).subscribe());
      }else{
        alt.error(res);
      }
    }));
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
    this.subscriptions.add(this.service.updateIMGemp(val).subscribe());
  }

  getErrorMessage(field: string): string{
    let message;
    if (this.editarForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.editarForm.get(field)!.hasError('minlength')){
        const minLength = this.editarForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.editarForm.get(field)!.hasError('maxlength')){
        const maxLength = this.editarForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`
    }else if (this.editarForm.get(field)!.hasError('pattern')){
      message = `Solo valores numéricos.`
    }
    return message;
  }

  isValidField(field: string): boolean{
    return ((this.editarForm.get(field)!.touched || this.editarForm.get(field)!.dirty)  && !this.editarForm.get(field)?.valid); 
   }

}
