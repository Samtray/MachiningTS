import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import * as alt from 'alertifyjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-editar',
  templateUrl: './agregar-editar.component.html',
  styleUrls: ['./agregar-editar.component.css']
})
export class AgregarEditarComponent implements OnInit, OnDestroy {

  

  constructor(private fb: FormBuilder, private service:ApiService, private authSvc: AuthService) { }

  grupoList:any=[];
  typeList:any=[];

  @Input() tool:any; 

  id!:string;
  codigo!:string;
  grupo!:string;
  medida!:string;
  filos!:string;
  tipo!:string;
  noParte!:string;
  nombre!:string;
  proveedor!:string;
  actual!:number;
  precio!:number;
  descripcion!:string;
  foto!:string;
  nivelInventario!:string;
  nivelBajo!:number;
  nivelMedio!:number;
  nivelAlto!:number;

  currentUser!: string;
	private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();

  actualPattern = /^[0-9]*$/;
  precioPattern = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;

  herramientaForm = this.fb.group({
    codigo: ['', [Validators.maxLength(100)]],
    grupo: ['', [Validators.required]],
    medida: ['', [Validators.maxLength(50)]],
    filos: ['', [Validators.maxLength(20)]],
    tipo: ['', [Validators.required]],
    noParte: ['',[Validators.maxLength(50)] ],
    nombre: ['', [Validators.required, Validators.maxLength(500)]],
    proveedor: ['', [Validators.maxLength(500)]],
    actual: ['', [Validators.pattern(this.actualPattern)]],
    precio: ['', [Validators.pattern(this.precioPattern)]],
    descripcion: ['', ],
    nivelBajo: ['', [Validators.pattern(this.actualPattern)]],
    nivelMedio: ['', ],
    nivelAlto: ['', ],
  });

  ngOnInit(): void {
    this.refreshData();
    this.gatherGrupos();
    this.gatherTipos();
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
    //this.herramientaForm.get('id')!.setValue(this.tool.id);
    this.herramientaForm.get('codigo')!.setValue(this.tool.codigo);
    this.herramientaForm.get('grupo')!.setValue(this.tool.grupo);
    this.herramientaForm.get('medida')!.setValue(this.tool.medida);
    this.herramientaForm.get('filos')!.setValue(this.tool.filos);
    this.herramientaForm.get('tipo')!.setValue(this.tool.tipo);
    this.herramientaForm.get('noParte')!.setValue(this.tool.noParte);
    this.herramientaForm.get('nombre')!.setValue(this.tool.nombre);
    this.herramientaForm.get('proveedor')!.setValue(this.tool.proveedor);
    this.herramientaForm.get('actual')!.setValue(this.tool.actual);
    this.herramientaForm.get('precio')!.setValue(this.tool.precio);
    this.herramientaForm.get('descripcion')!.setValue(this.tool.descripcion);
    //this.herramientaForm.get('foto')!.setValue(this.tool.foto);
    //this.herramientaForm.get('nivelInventario')!.setValue(this.tool.nivelInventario);
    this.herramientaForm.get('nivelBajo')!.setValue(this.tool.nivelBajo);
    this.herramientaForm.get('nivelMedio')!.setValue(this.tool.nivelMedio);
    this.herramientaForm.get('nivelAlto')!.setValue(this.tool.nivelAlto);

    this.id=this.tool.id;
    this.codigo=this.tool.codigo;
    this.grupo=this.tool.grupo;
    this.medida=this.tool.medida;
    this.filos=this.tool.filos;
    this.tipo=this.tool.tipo;
    this.noParte=this.tool.noParte;
    this.nombre=this.tool.nombre;
    this.proveedor=this.tool.proveedor;
    this.actual=this.tool.actual;
    this.precio=this.tool.precio;
    this.descripcion=this.tool.descripcion;
    this.foto=this.tool.foto;
    this.nivelInventario=this.tool.nivelInventario;
    this.nivelBajo=this.tool.nivelBajo;
    this.nivelMedio=this.tool.nivelMedio;
    this.nivelAlto=this.tool.nivelAlto;
  }

  agregarHerramienta(){
    if(this.herramientaForm.invalid){
      return;
    }
    var val={
      id: this.id,
			codigo: this.herramientaForm.get('codigo')?.value,
			grupo: this.herramientaForm.get('grupo')?.value,
			medida: this.herramientaForm.get('medida')?.value,
			filos: this.herramientaForm.get('filos')?.value,
			tipo: this.herramientaForm.get('tipo')?.value,
			noParte: this.herramientaForm.get('noParte')?.value,
			nombre: this.herramientaForm.get('nombre')?.value,
			proveedor: this.herramientaForm.get('proveedor')?.value,
			actual:  this.herramientaForm.get('actual')?.value,
			precio: this.herramientaForm.get('precio')?.value,
			descripcion: this.herramientaForm.get('descripcion')?.value,
			foto: this.foto,
			nivelInventario: this.nivelInventario,
			nivelBajo: this.herramientaForm.get('nivelBajo')?.value,
			nivelMedio: this.herramientaForm.get('nivelMedio')?.value,
			nivelAlto: this.herramientaForm.get('nivelAlto')?.value
    };
    var val2={uno: this.currentUser, dos: this.herramientaForm.get('nombre')?.value}
    this.subscriptions.add(this.service.postHerramientas(val).subscribe(res=>{
      if(res == "Se ha registrado con éxito."){
        alt.success(res);
        this.subscriptions.add(this.service.postNuevaHerramientaHistorial(val2).subscribe());
      }else{
        alt.error(res);
      }
    }));
  }
  editarHerramienta(){
    if(this.herramientaForm.invalid){
      return;
    }
    var val={
      id: this.id,
			codigo: this.herramientaForm.get('codigo')?.value,
			grupo: this.herramientaForm.get('grupo')?.value,
			medida: this.herramientaForm.get('medida')?.value,
			filos: this.herramientaForm.get('filos')?.value,
			tipo: this.herramientaForm.get('tipo')?.value,
			noParte: this.herramientaForm.get('noParte')?.value,
			nombre: this.herramientaForm.get('nombre')?.value,
			proveedor: this.herramientaForm.get('proveedor')?.value,
			actual:  this.herramientaForm.get('actual')?.value,
			precio: this.herramientaForm.get('precio')?.value,
			descripcion: this.herramientaForm.get('descripcion')?.value,
			foto: this.foto,
			nivelInventario: this.nivelInventario,
			nivelBajo: this.herramientaForm.get('nivelBajo')?.value,
			nivelMedio: this.herramientaForm.get('nivelMedio')?.value,
			nivelAlto: this.herramientaForm.get('nivelAlto')?.value
    };
    var val2={uno: this.currentUser, dos: this.herramientaForm.get('nombre')?.value}
    this.subscriptions.add(this.service.putHerramientas(val).subscribe(res=>{
      //alert(res.toString());
      if(res == "Modificación exitosa."){
        alt.success(res);
        this.subscriptions.add(this.service.postEditarHerramientaHistorial(val2).subscribe());
      }else{
        alt.error(res);
      }
    }));
  }

  gatherGrupos(){
    this.subscriptions.add(this.service.getGrupo().subscribe(data=>{
      this.grupoList=data;
    }));
  }
  gatherTipos(){
    this.subscriptions.add(this.service.getTipos().subscribe(data=>{
      this.typeList=data;
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
    this.subscriptions.add(this.service.deleteIMG(this.foto).subscribe());
    this.subscriptions.add(this.service.uploadIMG(formData).subscribe((data: any)=>{
      this.foto = data.toString();
      var val={
        id: this.id,
        foto: this.foto
      };
      this.editarFoto(val);
      //this.PhotoFilePath = this.service.Photos + this.PhotoFileName;
      }));
    // this.editarFoto();
   }

  editarFoto(val: any){
    this.subscriptions.add(this.service.updateIMGinv(val).subscribe());
  }

  getErrorMessage(field: string): string{
    let message;
    if (this.herramientaForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.herramientaForm.get(field)!.hasError('minlength')){
        const minLength = this.herramientaForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.herramientaForm.get(field)!.hasError('maxlength')){
        const maxLength = this.herramientaForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`
    }else if (this.herramientaForm.get(field)!.hasError('pattern')){
      message = `Solo valores numéricos.`
    }
    return message;
  }

  isValidField(field: string): boolean{
    return ((this.herramientaForm.get(field)!.touched || this.herramientaForm.get(field)!.dirty)  && !this.herramientaForm.get(field)?.valid); 
   }

   numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
