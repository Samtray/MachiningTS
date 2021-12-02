import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { ApiService } from '../api.service';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import * as alt from 'alertifyjs';
import * as moment from 'moment';
import { TiposGruposComponent } from './tipos-grupos/tipos-grupos.component';

export class Group {
	level = 0;
	expanded = false;
	totalCounts = 0;
}

export class Her {
	id: string = '';
	nombre: string = '';
	grupo: string = '';
	ultimoMovimiento: string = '';
}

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
})

export class InventoryListComponent implements OnInit, OnDestroy {

  public dataSource = new MatTableDataSource<any | Group>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  	columns!: any[];
	displayedColumns!: string[];
	groupByColumns: string[] = [];
	allData!: any[];
	_allGroup!: any[];

  	expandedHer: any[] = [];
	expandedSubHer: Her[] = [];

	HerramientaList:any=[];
	HerramientaList2:any=[];/*borra esto*/
	ModalTitle!:string;
	ModalTitle2!:string;
	ActivateAddEditToolComp:boolean=false;
	ActivateTipoGrupoComp:boolean=false;
	ActivateSumaComp:boolean=false;
	ActivateRestaComp:boolean=false;


	botonHabilitado:boolean=false;

	tool:any;
	tipoGrupo:any;
	herramientaSuma:any;
	herramientaResta:any;

	id!:number;
	cambio!:number;
	inventario!:number;

	herrid!:string;
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
	isAdmin = 'Null';

	itemSent: any;
	itemSentValid!: boolean;

	private subscriptions: Subscription = new Subscription(); 
  	private destroy$: Subject<boolean> = new Subject();

	currentUser!: string;
	@ViewChild(TiposGruposComponent) child!:TiposGruposComponent;

  	constructor(protected dataSourceService:ApiService, private authSvc: AuthService) {

    this.columns = [{
			field: 'Nombre'
		},{
			field: 'Ultima Modificación'
		},
		{
			field: 'Nivel'
		},];

    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['grupo'];
   }

	date(date:string){
		moment.locale('es');
		var date2 = moment(date);
		return date2.fromNow()
	}

  ngOnInit(): void {
	this.authSvc.itemSentValid.pipe(
		takeUntil(this.destroy$))
	  .subscribe(res=>{this.itemSentValid = res
		this.refreshHerramientaList();});

		this.authSvc.isAdmin$.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>(this.isAdmin = res));
		
		  this.authSvc.currentUser.pipe(
			takeUntil(this.destroy$))
		  .subscribe(res=>{this.currentUser = res;});

    }

	ngOnDestroy(): void{
		this.destroy$.next(true);
    	this.destroy$.complete();
		this.subscriptions.unsubscribe();
		this.authSvc.itemSentValid.next(false);
	  }

	gatherInfo(item:any){
		this.HerramientaList=item;
		this.botonHabilitado=true;
	}

	refreshHerramientaList(){
		this.botonHabilitado=false;
		this.HerramientaList = {
		  
			nombre: "SELECCIONE UNA HERRAMIENTA DEL INVENTARIO", 
  
			codigo: "-", 
  
			descripcion: "-", 

			medida:"-",

			filos:"-",

			noParte:"-",

			proveedor:"-",

			precio:"-",
  
			actual:"-",
			
			foto:"https://i.imgur.com/LfIXaeT.png",
  
			nivelInventario:"-",
  
			grupo:"-",
  
			tipo:"-",

		  };

		  if(this.itemSentValid){
			this.itemSentValid = false;
			this.authSvc.itemSent.pipe(
				takeUntil(this.destroy$))
			  .subscribe(res=>{this.itemSent = res
				this.HerramientaList = this.itemSent;
				this.botonHabilitado=true;
	})};	

	this.subscriptions.add(
		this.dataSourceService.getHerramientas().subscribe(data=>{
			this.allData=data;
			this.inventario=this.allData.length;
			this.dataSource.data=this.getGroups(this.allData,this.groupByColumns);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort; 
		  }));
	}

	
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	
		if (this.dataSource.paginator) {
		  this.dataSource.paginator.firstPage();
		}
	  }
	  

	refreshHerramientaList2(item){
		this.subscriptions.add(
			this.dataSourceService.getHerramientasEspecifica(item).subscribe(data=>{
			this.HerramientaList2=data;
			this.poblarVariables();
		  }));
	}
	poblarVariables(){
		this.id=this.HerramientaList2[0].id;
		this.codigo=this.HerramientaList2[0].codigo;
		this.grupo=this.HerramientaList2[0].grupo;
		this.medida=this.HerramientaList2[0].medida;
		this.filos=this.HerramientaList2[0].filos;
		this.tipo=this.HerramientaList2[0].tipo;
		this.noParte=this.HerramientaList2[0].noParte;
		this.nombre=this.HerramientaList2[0].nombre;
		this.proveedor=this.HerramientaList2[0].proveedor;
		this.actual=this.HerramientaList2[0].actual;
		this.precio=this.HerramientaList2[0].precio;
		this.descripcion=this.HerramientaList2[0].descripcion;
		this.foto=this.HerramientaList2[0].foto;
		this.nivelInventario=this.HerramientaList2[0].nivelInventario;
		this.nivelBajo=this.HerramientaList2[0].nivelBajo;
		this.nivelMedio=this.HerramientaList2[0].nivelMedio;
		this.nivelAlto=this.HerramientaList2[0].nivelAlto;

		var val={
			id: this.id,
				  codigo: this.codigo,
				  grupo: this.grupo,
				  medida: this.medida,
				  filos: this.filos,
				  tipo: this.tipo,
				  noParte: this.noParte,
				  nombre: this.nombre,
				  proveedor: this.proveedor,
				  actual:  this.actual,
				  precio: this.precio,
				  descripcion: this.descripcion,
				  foto: this.foto,
				  nivelInventario: this.nivelInventario,
				  nivelBajo: this.nivelBajo,
				  nivelMedio: this.nivelMedio,
				  nivelAlto: this.nivelAlto
		  };
		this.HerramientaList=val;
	}

	addClick(){
		this.tool={
			id: 0,
			codigo: null,
			grupo: null,
			medida: null,
			filos: null,
			tipo: null,
			noParte: null,
			nombre: null,
			proveedor: null,
			actual: 0,
			precio: 0.0,
			descripcion: null,
			foto: "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
			nivelInventario: null,
			nivelBajo: 5,
			nivelMedio: 10,
			nivelAlto: 20
		}
		this.ModalTitle="Agregar Nueva Herramienta"
		this.ActivateAddEditToolComp=true;
	}

	addTipoGrupo(){
		this.tipoGrupo={
			nombreGrupo:null,
			nombreTipo:null

		}
		this.ModalTitle="Agregar un Tipo o un Grupo"
		this.ActivateTipoGrupoComp=true;
	}

	editClick(item){
		this.tool=item;
		this.ModalTitle="Editar Herramienta";
		this.ActivateAddEditToolComp=true;
	}

	closeClick(){
		this.ActivateAddEditToolComp=false;
		this.ActivateSumaComp=false;
		this.refreshHerramientaList();
	}

	closeClickGrupoTipo(){
		this.ActivateAddEditToolComp=false;
		this.ActivateSumaComp=false;
		this.child.resetForm();
		this.refreshHerramientaList();
	}

	closeClickSumarRestar(){
		this.ActivateAddEditToolComp=false;
		this.ActivateRestaComp=false;
		this.refreshHerramientaList();
	}
	

	deleteClick(item){
		var val2={uno: this.currentUser, dos: item.nombre}
		alt.confirm("¿Estás Seguro?",
		()=>{
			this.subscriptions.add(
				this.dataSourceService.deleteHerramientas(item.id).subscribe(data=>{
				if(data == "Borrado exitosamente."){
				alt.success(data);
				this.subscriptions.add(
					this.dataSourceService.postBorrarHerramientaHistorial(val2).subscribe());
					this.subscriptions.add(
						this.dataSourceService.deleteIMG(item.foto).subscribe());
				this.refreshHerramientaList();
				}else{
				alt.error(data);
				}
			})
			)},
	  () => {
			alt.error('Operación Cancelada');
		}).set({title:"Confirmar borrado de Herramienta"}).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}});;
	
	}

	sumarClick(item){

		this.herramientaResta=item;
		this.ModalTitle2=item.nombre;
		this.ActivateRestaComp=true;
		this.dataResta();
	}

	restarClick(item){
		this.herramientaResta=item;
		this.ModalTitle2=item.nombre;
		this.ActivateRestaComp=true;
		this.dataResta();
	}

	dataResta(){
		this.id=this.herramientaResta.id;
		this.cambio=this.herramientaResta.cambio;
	}

	restarInventario(){
		var val={
		  id:this.id,
		  cambio:this.cambio
		}
		var val2={
			usuario: this.currentUser,
			herramienta: this.HerramientaList.grupo,
			nombre:this.HerramientaList.nombre,
			altas: 0,
			bajas: this.cambio
		}
		var val3={
			uno: this.currentUser,
			dos: this.cambio,
			tres: this.HerramientaList.nombre
		}
		this.subscriptions.add(
			this.dataSourceService.postResta(val).subscribe(res=>{
		  this.refreshHerramientaList2(this.id);
		  if(res == "Se ha restado exitosamente."){
		  	alt.success(res);
			  this.subscriptions.add(
				this.authSvc.notifications());			
				this.subscriptions.add(
				this.dataSourceService.postInventarioHistorial(val2).subscribe());
				this.subscriptions.add(
				this.dataSourceService.postRestarHerramientaHistorial(val3).subscribe());
		  }
		  else{
		  alt.error(res);
		  }
		}));
	}

	sumarInventario(){
		var val={
		  id:this.id,
		  cambio:this.cambio
		}
		var val2={
			usuario: this.currentUser,
			herramienta: this.HerramientaList.grupo,
			nombre:this.HerramientaList.nombre,
			altas: this.cambio,
			bajas: 0
		}
		var val3={
			uno: this.currentUser,
			dos: this.cambio,
			tres: this.HerramientaList.nombre
		}
		this.subscriptions.add(
			this.dataSourceService.postSuma(val).subscribe(res=>{
		  //alert(res.toString());
		  this.refreshHerramientaList2(this.id);
		  if(res == "Se ha sumado exitosamente."){
		  	alt.success(res);
			this.authSvc.notifications();			
			this.subscriptions.add(
				this.dataSourceService.postInventarioHistorial(val2).subscribe());
				this.subscriptions.add(
					this.dataSourceService.postSumarHerramientaHistorial(val3).subscribe());
		 }else{
			alt.error(res);
		 }
		}));
		// this.dataSourceService.postInventarioHistorial(val2).subscribe();

	}

  groupHeaderClick(row) {

		if (row.expanded) {
			row.expanded = false;
			this.dataSource.data = this.getGroups(this.allData, this.groupByColumns);
		} else {
      this._allGroup.forEach((item, index) => { item.expanded = false; });
			row.expanded = true;
			this.expandedHer = row;
			this.dataSource.data = this.addGroupsNew(this._allGroup, this.allData, this.groupByColumns, row);
		}
	}



  getGroups(data:any[], groupByColumns:string[]):any[]{
    const rootGroup = new Group();
    rootGroup.expanded = false;
    return this.getGroupList(data, 0, groupByColumns, rootGroup);
  }

  getGroupList(data: any[], level: number = 0, groupByColumns: string[], parent: Group) : any[] {
    if (level >= groupByColumns.length) {
			return data;
		}

    let groups = this.uniqueBy(
			data.map(
				row => {
					const result = new Group();
					result.level = level + 1;
					for (let i = 0; i <= level; i++) {
						result[groupByColumns[i]] = row[groupByColumns[i]];
					}
					return result;
				}
			),
			JSON.stringify);

      const currentColumn = groupByColumns[level];
		  let subGroups = [];
		  groups.forEach(group => {
			  const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
			  group.totalCounts = rowsInGroup.length;
			  this.expandedSubHer = [];
		  });

      groups = groups.sort((a: Her, b: Her) => {
        const isAsc = 'asc';
        return this.compare(a.grupo, b.grupo, isAsc);
  
      });
      this._allGroup = groups;
		  return groups;
  }

  addGroupsNew(allGroup: any[], data: any[], groupByColumns: string[], dataRow: any): any[] {
		const rootGroup = new Group();
		rootGroup.expanded = true;
		return this.getSublevelNew(allGroup, data, 0, groupByColumns, rootGroup, dataRow);
	}

  getSublevelNew(allGroup: any[], data: any[], level: number, groupByColumns: string[], parent: Group, dataRow: any): any[] {
		if (level >= groupByColumns.length) {
			return data;
		}
		const currentColumn = groupByColumns[level];
		let subGroups = [];
		allGroup.forEach(group => {
			const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
			group.totalCounts = rowsInGroup.length;

			if (group.grupo == dataRow.grupo.toString()) {
				group.expanded = dataRow.expanded;
				let subGroup = this.getSublevelNew(allGroup, rowsInGroup, level + 1, groupByColumns, group, dataRow.grupo.toString()) as any;
				this.expandedSubHer = subGroup;
				subGroup.unshift(group);
				subGroups = subGroups.concat(subGroup);
			} else {
				subGroups = subGroups.concat(group);
			}
		});
		return subGroups;
	}

  uniqueBy(a, key) {
		const seen = {};
		return a.filter((item) => {
			const k = key(item);
			return seen.hasOwnProperty(k) ? false : (seen[k] = true);
		});
	}

  isGroup(index, item): boolean {
		return item.level;
	}

  private compare(a, b, isAsc) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}




}

