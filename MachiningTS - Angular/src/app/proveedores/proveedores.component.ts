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
  foto: string;
}

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['foto','nombre','telefono','correo','direccion','iconos'];
  dataSource!: MatTableDataSource<UserData>;
  constructor(private service:ApiService,private authSvc: AuthService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  proveedorInfo:any=[];
  ModalTitle!:string;
  agregarModal:boolean=false;
  proveedor:any;
  numeroproveedores!:number;
  isAdmin = 'Null';
  currentUser!: string;
  private subscriptions = new Subscription();
  private destroy$: Subject<boolean> = new Subject();
  ngOnInit(): void {
    this.refreshProveedores();

    this.authSvc.isAdmin$.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>(this.isAdmin = res))

      this.authSvc.currentUser.pipe(
        takeUntil(this.destroy$))
        .subscribe(res=>{this.currentUser = res;});
  }


  refreshProveedores(){
    this.subscriptions.add(this.service.getProveedor().subscribe(res=>{
      this.proveedorInfo=res;
      this.numeroproveedores=this.proveedorInfo.length;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = this.proveedorInfo;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
    }));

  }
  agregarProveedor(){
    this.proveedor={
			id: 0,
      foto: "https://turbologo.com/articles/wp-content/uploads/2019/05/no-logo.png.webp",
      nombre: null,
			telefono: null,
			correo: null,
			direccion: null
		}
		this.ModalTitle="Agregar nuevo Proveedor"
		this.agregarModal=true;
  }

  editarProveedor(item){
    this.proveedor=item;
		this.ModalTitle="Editar Proveedor";
		this.agregarModal=true;
  }

  closeClick(){
		this.agregarModal=false;
		this.refreshProveedores();
  }

  borrarProveedor(item){
    alt.confirm("¿Estás Seguro?",
		()=>{
      this.subscriptions.add(this.service.deleteProveedor(item.id).subscribe(res=>{
        var val={uno: this.currentUser, dos: item.nombre}
          if(res == "Borrado exitosamente."){
            alt.success(res);
            this.subscriptions.add(this.service.deleteIMG(item.foto).subscribe());
            this.subscriptions.add(this.service.postBorrarProveedorHistorial(val).subscribe());
            this.refreshProveedores();
          }else{
            alt.error(res);
          }
        }));
  
    },
	  () => {
			alt.error('Operación Cancelada');
		}).set({title:"Confirmar borrado de Proveedor"}).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}});;
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
