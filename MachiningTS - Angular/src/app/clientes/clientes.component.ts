import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { ApiService } from 'src/app/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AuthService } from '../auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import * as alt from 'alertifyjs';

export interface UserData {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['nombre','telefono','correo','direccion','iconos'];
  dataSource!: MatTableDataSource<UserData>;
  constructor(private service:ApiService,private authSvc: AuthService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  clienteInfo:any=[];
  ModalTitle!:string;
  agregarModal:boolean=false;
  cliente:any;
  numeroclientes!:number;
  isAdmin = 'Null';
  currentUser!: string;

  private subscriptions = new Subscription();
  private destroy$: Subject<boolean> = new Subject();

  ngOnInit(): void {

    this.refreshClientes();

    this.authSvc.isAdmin$.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>(this.isAdmin = res))

      this.authSvc.currentUser.pipe(
        takeUntil(this.destroy$))
        .subscribe(res=>{this.currentUser = res;});
  }


  refreshClientes(){
    this.subscriptions.add(this.service.getClientes().subscribe(res=>{
      this.clienteInfo=res;
      this.numeroclientes=this.clienteInfo.length;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = this.clienteInfo;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
    }));

  }

  agregarCliente(){
    this.cliente={
			id: 0,
      nombre: null,
			telefono: null,
			correo: null,
			direccion: null
		}
		this.ModalTitle="Agregar nuevo Cliente"
		this.agregarModal=true;
  }

  editarCliente(item){
    this.cliente=item;
		this.ModalTitle="Editar Cliente";
		this.agregarModal=true;
  }

  closeClick(){
		this.agregarModal=false;
		this.refreshClientes();
  }

  borrarClientes(item){
    alt.confirm("¿Estás Seguro?",
		()=>{
      this.subscriptions.add(this.service.deleteClientes(item.id).subscribe(res=>{
        var val={uno: this.currentUser, dos: item.nombre}
          if(res == "Borrado exitosamente."){
            alt.success(res);
            this.subscriptions.add(this.service.postBorrarClienteHistorial(val).subscribe());
            this.refreshClientes();
          }else{
            alt.error(res);
          }
        }));
  
    },
	  () => {
			alt.error('Operación Cancelada');
		}).set({title:"Confirmar borrado de Cliente"}).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}});;

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

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }

}
