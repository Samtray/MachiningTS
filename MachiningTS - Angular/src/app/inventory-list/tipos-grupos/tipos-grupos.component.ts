import { Component, OnInit,Input, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import * as alt from 'alertifyjs';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-tipos-grupos',
  templateUrl: './tipos-grupos.component.html',
  styleUrls: ['./tipos-grupos.component.css']
})
export class TiposGruposComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,private service:ApiService) { }
  grupoList:any=[];
  typeList:any=[];
  @Input() tipoGrupo:any;
  nombreGrupo!:string;
  nombreTipo!:string;

  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();

  @ViewChild('formDirective') private formDirective!: NgForm;
  @ViewChild('formDirective2') private formDirective2!: NgForm;

  
  grupoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });
  tipoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });


  ngOnInit(): void {
    this.nombreGrupo=this.tipoGrupo.nombreGrupo;
    this.nombreTipo=this.tipoGrupo.nombreTipo;
    this.gatherGrupos();
    this.gatherTipos();
  }

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }


  agregarGrupo(){
    var val={
      nombre: this.grupoForm.get('nombre')?.value,
    };
    this.subscriptions.add(this.service.postGrupos(val).subscribe(res=>{
      // alert(res.toString());
      if(res == 'Se ha registrado con éxito.'){
        this.formDirective.resetForm();  
        alt.success(res);
      this.gatherGrupos();
      }else{
      alt.error(res);
      }
    }));
  }

  agregarTipo(){
    var val={
      nombre: this.tipoForm.get('nombre')?.value,
    };
    this.subscriptions.add(this.service.postTipos(val).subscribe(res=>{
      if(res == 'Se ha registrado con éxito.'){
      this.formDirective2.resetForm();  
      alt.success(res);
      this.gatherTipos();
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


  borrarTipo(item){
		// if(confirm('¿Estás Seguro?')){
		// 	this.service.deleteTipos(item.id).subscribe(data=>{
		// 		alert(data.toString());
    //     this.gatherTipos();
		// 	});
		// }

    alt.confirm("¿Estás Seguro?",
		()=>{
      this.subscriptions.add(this.service.deleteTipos(item.id).subscribe(data=>{
				// alert(data.toString());
        if(data == "Borrado exitosamente."){
        this.gatherTipos();
        alt.success(data);
         }else{
           alt.error(data);
          }
			}));
	  	},
	  () => {
			alt.error('Operación Cancelada');
		}).set({title:"Confirmar borrado de Tipo"}).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}});;


	}

  borrarGrupo(item){
		// if(confirm('¿Estás Seguro?')){
		// 	this.service.deleteGrupos(item.id).subscribe(data=>{
		// 		alert(data.toString());
    //     this.gatherGrupos();
		// 	});
		// }
    alt.confirm("¿Estás Seguro?",
		()=>{
      this.subscriptions.add(this.service.deleteGrupos(item.id).subscribe(data=>{
				// alert(data.toString());
        if(data == "Borrado exitosamente."){
        this.gatherGrupos();
        alt.success(data);
         }else{
           alt.error(data);
          }
			}));
	  	},
	  () => {
			alt.error('Operación Cancelada');
		}).set({title:"Confirmar borrado de Grupo"}).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}});;

	}

  getErrorMessage(field: string): string{
    let message;
    if (this.grupoForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.grupoForm.get(field)!.hasError('minlength')){
        const minLength = this.grupoForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.grupoForm.get(field)!.hasError('maxlength')){
        const maxLength = this.grupoForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`
    }else if (this.grupoForm.get(field)!.hasError('pattern')){
      message = `Solo valores numéricos.`
    }
    return message;
  }

  isValidField(field: string): boolean{
    return ((this.grupoForm.get(field)!.touched || this.grupoForm.get(field)!.dirty)  && !this.grupoForm.get(field)?.valid); 
   }


   getErrorMessage2(field: string): string{
    let message;
    if (this.tipoForm.get(field)!.hasError('required')){
      message = 'Debes ingresar un valor.'
     }else if(this.tipoForm.get(field)!.hasError('minlength')){
        const minLength = this.tipoForm.get(field)!.errors?.minlength.requiredLength;
        message = `Este campo debe tener al menos ${minLength}  caracteres.`
    }else if (this.tipoForm.get(field)!.hasError('maxlength')){
        const maxLength = this.tipoForm.get(field)?.errors?.maxlength.requiredLength;
        message = `Este campo debe tener máximo ${maxLength} caracteres.`
    }else if (this.tipoForm.get(field)!.hasError('pattern')){
      message = `Solo valores numéricos.`
    }
    return message;
  }

  isValidField2(field: string): boolean{
    return ((this.tipoForm.get(field)!.touched || this.tipoForm.get(field)!.dirty)  && !this.tipoForm.get(field)?.valid); 
   }

  resetForm(){
    this.formDirective.resetForm();  
    this.formDirective2.resetForm();  
  }
   
}
