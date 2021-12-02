import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import { ApiService } from 'src/app/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import * as alt from 'alertifyjs';
import { AuthService } from '../auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

export interface UserData {
  id: string;
  nombre: string;
  usuario: string;
  contrasena: string;
  foto: string;
  rol: string;
  ultimaSesion: string;
  totalMovimientos: string;
  ultimaModificacion: string;
}
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['foto','nombre', 'usuario', 'rol','iconos'];
  dataSource!: MatTableDataSource<UserData>;
  constructor(private service:ApiService,private authSvc: AuthService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  numeroempleados!:number;
  empleadosInfo:any=[];
  empleadosList:any=[];
  ModalTitle!:string;
  agregarModal:boolean=false;
  agregarModalContra:boolean=false;
  agregarModalEmpleado:boolean=false;
  empleado:any;
  empleado2:any;
  currentUser!: string;
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();
	isAdmin = 'Null';

  ngOnInit(): void {
    this.authSvc.isAdmin$.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>(this.isAdmin = res))

      this.authSvc.currentUser.pipe(
        takeUntil(this.destroy$))
        .subscribe(res=>{this.currentUser = res;});
    this.refreshEmpleados();
  }

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }


  refreshEmpleados(){
    this.empleadosList = {
			id: "",
      nombre: "Seleccione algún Usuario",
      usuario: null,
			contrasena: null,
			foto:"https://i.imgur.com/LfIXaeT.png",
			rol: "",
      ultimaSesion:"",
      totalMovimientos:"",
      ultimaModificacion:""

		  };
      this.subscriptions.add(this.service.getEmpleado().subscribe(res=>{
      this.empleadosInfo=res;
      this.numeroempleados=this.empleadosInfo.length;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = this.empleadosInfo;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
    }));
  }

  agregarEmpleado(){
    this.empleado={
			id: 0,
      nombre: null,
      usuario: null,
			contrasena: null,
			foto:"https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
			rol: null,
      ultimaSesion:null,
      totalMovimientos:null,
      ultimaModificacion:null
		}
		this.ModalTitle="Agregar nuevo Empleado"
		this.agregarModal=true;
  }

  editarEmpleado(item){
    this.empleado2=item;
		this.ModalTitle="Editar Empleado";
		this.agregarModalEmpleado=true;
  }

  editarContra(item){
    this.empleado=item;
		this.ModalTitle="Editar Contraseña";
		this.agregarModalContra=true;
  }

  borrarEmpleado(item){

    alt.confirm("¿Estás Seguro?",
		()=>{
      this.subscriptions.add(this.service.deleteEmpleado(item.id).subscribe(res=>{
				var val={uno: this.currentUser, dos: item.usuario}
				if(res == "Borrado exitosamente."){
          alt.success(res);
    			this.subscriptions.add(this.service.deleteIMG(item.foto).subscribe());
          this.subscriptions.add(this.service.postBorrarEmpleadoHistorial(val).subscribe());
				  this.refreshEmpleados();
        }else{
          alt.error(res);
        }
			}));
	  	},
	  () => {
			alt.error('Operación Cancelada');
		}).set({title:"Confirmar borrado de Empleado"}).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}});;
	}

  gatherInfo(item){
    this.empleadosList=item;
  }

  closeClick(){
		this.agregarModal=false;
    this.agregarModalEmpleado=false;
    this.agregarModalContra=false;
		this.refreshEmpleados();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }


}
