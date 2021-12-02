import { Component, OnInit,Input, OnDestroy  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import * as alt from 'alertifyjs';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})
export class AgregarClienteComponent implements OnInit, OnDestroy {

  constructor(private service:ApiService, private fb: FormBuilder, private authSvc: AuthService) { }

  @Input() cliente:any; 
  id!:string;
  nombre!:string;
  telefono!:string;
  correo!:string;
  direccion!:string;

  currentUser!: string;
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();

  clienteForm = this.fb.group({
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
    this.clienteForm.get('nombre')!.setValue(this.cliente.nombre);
    this.clienteForm.get('telefono')!.setValue(this.cliente.telefono);
    this.clienteForm.get('correo')!.setValue(this.cliente.correo);
    this.clienteForm.get('direccion')!.setValue(this.cliente.direccion);


    this.id=this.cliente.id;
    this.nombre=this.cliente.nombre;
    this.telefono=this.cliente.telefono;
    this.correo=this.cliente.correo;
    this.direccion=this.cliente.direccion;
  }

  agregarCliente(){
    if(this.clienteForm.invalid){
      return;
    }
    var val={
      id: this.id,
			nombre: this.clienteForm.get('nombre')?.value,
			telefono: this.clienteForm.get('telefono')?.value,
			correo: this.clienteForm.get('correo')?.value,
			direccion: this.clienteForm.get('direccion')?.value,
    };
    var val2={uno: this.currentUser, dos: this.clienteForm.get('nombre')?.value}
    this.subscriptions.add(this.service.postClientes(val).subscribe(res=>{
      if(res == "Se ha registrado con éxito."){
        alt.success(res);
        this.subscriptions.add(this.service.postNuevoClienteHistorial(val2).subscribe());
      }else{
        alt.error(res);
      }
    }));
  }

  editarCliente(){
    if(this.clienteForm.invalid){
      return;
    }
    var val={
      id: this.id,
			nombre: this.clienteForm.get('nombre')?.value,
			telefono: this.clienteForm.get('telefono')?.value,
			correo: this.clienteForm.get('correo')?.value,
			direccion: this.clienteForm.get('direccion')?.value,
    };
    var val2={uno: this.currentUser, dos: this.clienteForm.get('nombre')?.value}
    this.subscriptions.add(this.service.putClientes(val).subscribe(res=>{
      if(res == "Modificación exitosa."){
        alt.success(res);
        this.subscriptions.add(this.service.postEditarClienteHistorial(val2).subscribe());
      }else{
        alt.error(res);
      }
    }));
  }

  getErrorMessage(field: string): string{
    let message;
    if (this.clienteForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.clienteForm.get(field)!.hasError('minlength')){
        const minLength = this.clienteForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.clienteForm.get(field)!.hasError('maxlength')){
        const maxLength = this.clienteForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`
    }else if (this.clienteForm.get(field)!.hasError('pattern')){
      message = `Solo valores numéricos.`
    }
    return message;
  }

  isValidField(field: string): boolean{
    return ((this.clienteForm.get(field)!.touched || this.clienteForm.get(field)!.dirty)  && !this.clienteForm.get(field)?.valid); 
   }

   ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }

}
