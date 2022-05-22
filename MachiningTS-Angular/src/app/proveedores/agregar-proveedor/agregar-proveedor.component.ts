import { Component, OnInit,Input, OnDestroy  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import * as alt from 'alertifyjs';

@Component({
  selector: 'app-agregar-proveedor',
  templateUrl: './agregar-proveedor.component.html',
  styleUrls: ['./agregar-proveedor.component.css']
})
export class AgregarProveedorComponent implements OnInit, OnDestroy {

  constructor(private service:ApiService, private fb: FormBuilder, private authSvc: AuthService) { }

  @Input() proveedor:any; 
  id!:string;
  foto!:string;
  nombre!:string;
  telefono!:string;
  correo!:string;
  direccion!:string;

  currentUser!: string;
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();

  proveedorForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(500)]],
    telefono: ['', [Validators.maxLength(20)]],
    correo: ['', [Validators.maxLength(200)]],
    direccion: ['', ],
  });

  ngOnInit(): void {
    this.refreshData();
    this.authSvc.currentUser.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>{
        this.currentUser = res;
      });
  }

  refreshData(){
    this.proveedorForm.get('nombre')!.setValue(this.proveedor.nombre);
    this.proveedorForm.get('telefono')!.setValue(this.proveedor.telefono);
    this.proveedorForm.get('correo')!.setValue(this.proveedor.correo);
    this.proveedorForm.get('direccion')!.setValue(this.proveedor.direccion);


    this.id=this.proveedor.id;
    this.foto=this.proveedor.foto;
    this.nombre=this.proveedor.nombre;
    this.telefono=this.proveedor.telefono;
    this.correo=this.proveedor.correo;
    this.direccion=this.proveedor.direccion;
  }

  agregarProveedor(){
    if(this.proveedorForm.invalid){
      return;
    }
    var val={
      id: this.id,
			foto: this.foto,
			nombre: this.proveedorForm.get('nombre')?.value,
			telefono: this.proveedorForm.get('telefono')?.value,
			correo: this.proveedorForm.get('correo')?.value,
			direccion: this.proveedorForm.get('direccion')?.value,
    };
    var val2={uno: this.currentUser, dos: this.proveedorForm.get('nombre')?.value}
    this.subscriptions.add(this.service.postProveedor(val).subscribe(res=>{
      if(res == "Se ha registrado con éxito."){
        alt.success(res);
        this.subscriptions.add(this.service.postNuevoProveedorHistorial(val2).subscribe());
      }else{
        alt.error(res);
      }
    }));
  }

  editarProveedor(){
    if(this.proveedorForm.invalid){
      return;
    }
    var val={
      id: this.id,
			foto: this.foto,
			nombre: this.proveedorForm.get('nombre')?.value,
			telefono: this.proveedorForm.get('telefono')?.value,
			correo: this.proveedorForm.get('correo')?.value,
			direccion: this.proveedorForm.get('direccion')?.value,
    };
    var val2={uno: this.currentUser, dos: this.proveedorForm.get('nombre')?.value}
    this.subscriptions.add(this.service.putProveedor(val).subscribe(res=>{
      if(res == "Modificación exitosa."){
        alt.success(res);
        this.subscriptions.add(this.service.postEditarProveedorHistorial(val2).subscribe());
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

  updateProfilePhoto(event: any){
    var file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('uploadedFile', file, file.name);
    console.log(this.foto);
    this.subscriptions.add(this.service.deleteIMG(this.foto).subscribe());
    this.subscriptions.add(this.service.uploadIMG(formData).subscribe((data: any)=>{
      this.foto = data.toString();
      var val={
        id: this.id,
        foto: this.foto
      };
      console.log(val);
      this.editarFoto(val);
      //this.PhotoFilePath = this.service.Photos + this.PhotoFileName;
      }));
    // this.editarFoto();
   }

  editarFoto(val: any){
    this.subscriptions.add(this.service.updateIMGprov(val).subscribe());
  }

  getErrorMessage(field: string): string{
    let message;
    if (this.proveedorForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.proveedorForm.get(field)!.hasError('minlength')){
        const minLength = this.proveedorForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.proveedorForm.get(field)!.hasError('maxlength')){
        const maxLength = this.proveedorForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`
    }else if (this.proveedorForm.get(field)!.hasError('pattern')){
      message = `Solo valores numéricos.`
    }
    return message;
  }

  isValidField(field: string): boolean{
    return ((this.proveedorForm.get(field)!.touched || this.proveedorForm.get(field)!.dirty)  && !this.proveedorForm.get(field)?.valid); 
   }


   ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }

}
