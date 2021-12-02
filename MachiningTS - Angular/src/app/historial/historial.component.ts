import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { ApiService } from '../api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import * as alt from 'alertifyjs';
import { AuthService } from '../auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

export interface UserData {
  id: string;
  usuario: string;
  fecha: string;
  contenido: string;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['tipo', 'contenido','fecha', 'usuario', 'foto'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allData: any=[];
  historialLength!: number;
  isAdmin = 'Null';
  private subscriptions: Subscription = new Subscription(); 
  private destroy$: Subject<boolean> = new Subject();
  
  constructor(private service: ApiService, private authSvc: AuthService) {

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.allData);

  }
  ngOnInit(): void {
    this.authSvc.isAdmin$.pipe(
      takeUntil(this.destroy$))
    .subscribe(res=>{this.isAdmin = res;})

    this.subscriptions.add(this.service.getHistorial().subscribe(data=>{
      		this.allData=data;
      		this.historialLength=this.allData.length;
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = this.allData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort; 
          this.translateMatPaginator(this.dataSource.paginator);
      	  }));
  }

  ngOnDestroy(): void{
    this.destroy$.next(true)
    this.destroy$.complete()
    this.subscriptions.unsubscribe();
  }


  borrarHistorial(){

      alt.confirm("¿Estás Seguro? Esto eliminará todos los registros del historial permanentemente.",
      ()=>{
        this.subscriptions.add(this.service.nukeHistorial().subscribe(res=>{
            if(res == "Eliminado exitoso."){
            alt.success(res);
            this.refreshList();
            }else{
              alt.error(res)
            }
          }));
        },
      () => {
        alt.error('Operación Cancelada');
      }).set({title:"Confirmar borrado de Historial"}).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}});;

  }

  refreshList(){
    this.subscriptions.add(this.service.getHistorial().subscribe(data=>{
      this.allData=data;
      this.historialLength=this.allData.length;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = this.allData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
      this.translateMatPaginator(this.dataSource.paginator);
      }));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  
  onImgError(event){
    event.target.src = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
   }
}
