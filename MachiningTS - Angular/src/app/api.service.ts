import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly APIUrl="http://192.168.0.4/MachTest/api";
  constructor(private http:HttpClient) { }

  getHerramientas():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Herramientas');
  }

  getHerramientasEspecifica(val:any):Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Herramientas/' + val);
  }

  postHerramientas(val:any){
    return this.http.post(this.APIUrl+'/Herramientas',val);
  }

  putHerramientas(val:any){
    return this.http.put(this.APIUrl+'/Herramientas',val);
  }

  deleteHerramientas(val:any){
    return this.http.delete(this.APIUrl+'/Herramientas/' + val);
  }


  getClientes():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Clientes');
  }

  postClientes(val:any){
    return this.http.post(this.APIUrl+'/Clientes',val);
  }

  putClientes(val:any){
    return this.http.put(this.APIUrl+'/Clientes',val);
  }

  deleteClientes(val:any){
    return this.http.delete(this.APIUrl+'/Clientes/' + val);
  }

  getGrupo():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Categorias');
  }
  
  getTipos():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Tipos');
  }

  uploadIMG(val:any){
    return this.http.post(this.APIUrl +'/fotos', val)
  }

  deleteIMG(val:any){
    return this.http.delete(this.APIUrl +'/fotos/borrar?img='+val)
  }

  updateIMGinv(val:any){
    return this.http.put(this.APIUrl +'/fotos/editarinv', val)
  }

  updateIMGprf(val:any){
    return this.http.put(this.APIUrl +'/fotos/editarprf', val)
  }

  updateIMGprov(val:any){
    return this.http.put(this.APIUrl +'/fotos/editarprov', val)
  }

  updateIMGclie(val:any){
    return this.http.put(this.APIUrl +'/fotos/editarclie', val)
  }

  updateIMGemp(val:any){
    return this.http.put(this.APIUrl +'/fotos/editaremp', val)
  }

  postSuma(val:any){
    return this.http.post(this.APIUrl+'/Sumar',val);
  }

  postResta(val:any){
    return this.http.post(this.APIUrl+'/Restar',val);
  }
  
  postTipos(val:any){
    return this.http.post(this.APIUrl+'/Tipos',val);
  }

  postGrupos(val:any){
    return this.http.post(this.APIUrl+'/Categorias',val);
  }

  getPerfil(val:any):Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/empleados/' + val);
  }

  postInventarioHistorial(val:any){
    return this.http.post(this.APIUrl+'/InventarioHistorial',val);
  }  

  postNuevaHerramientaHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/herramientainsert',val);
  }
  
  postEditarHerramientaHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/herramientaupdate',val);
  }  

  postBorrarHerramientaHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/herramientadelete',val);
  }  

  postSumarHerramientaHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/altaherramienta',val);
  }  

  postRestarHerramientaHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/bajaherramienta',val);
  }  

  postNuevoProveedorHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/proveedorinsert',val);
  }
  
  postEditarProveedorHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/proveedorupdate',val);
  }  

  postBorrarProveedorHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/proveedordelete',val);
  }  

  postNuevoEmpleadoHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/empleadoinsert',val);
  }
  
  postEditarEmpleadoHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/empleadoupdate',val);
  }  

  postBorrarEmpleadoHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/empleadodelete',val);
  } 

  postNuevoClienteHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/clienteinsert',val);
  }

  postEditarClienteHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/clienteupdate',val);
  } 

  postBorrarClienteHistorial(val:any){
    return this.http.post(this.APIUrl+'/historial/clientedelete',val);
  }  

  getHistorial(){
    return this.http.get(this.APIUrl+'/historial');
  } 

  nukeHistorial(){
    return this.http.get(this.APIUrl+'/historial/nuke');
  } 

  /*
  postNotificaciones(val:any){
    return this.http.post(this.APIUrl+'/notificaciones',val);
  }  

    getNotificaciones(val:any):Observable<any[]>{
      return this.http.get<any>(this.APIUrl+'/notificaciones/?usuario=' + val);
    }
    */

    getNewNotifcations():Observable<any[]>{
      return this.http.get<any>(this.APIUrl+'/notificaciones');
    }
    
    getEmpleado():Observable<any[]>{
      return this.http.get<any>(this.APIUrl+'/Empleados');
    }
  
    postEmpleado(val:any){
      return this.http.post(this.APIUrl+'/Empleados',val);
    }
    putEmpleado(val:any){
      return this.http.put(this.APIUrl+'/Empleados',val);
    }
    deleteEmpleado(val:any){
      return this.http.delete(this.APIUrl+'/Empleados/' + val);
    }

    getProveedor():Observable<any[]>{
      return this.http.get<any>(this.APIUrl+'/Proveedores');
    }
  
    postProveedor(val:any){
      return this.http.post(this.APIUrl+'/Proveedores',val);
    }
    putProveedor(val:any){
      return this.http.put(this.APIUrl+'/Proveedores',val);
    }
    deleteProveedor(val:any){
      return this.http.delete(this.APIUrl+'/Proveedores/' + val);
    }

    deleteTipos(val:any){
      return this.http.delete(this.APIUrl+'/Tipos/' + val);
    }
  
    deleteGrupos(val:any){
      return this.http.delete(this.APIUrl+'/Categorias/' + val);
    }

    getGraph():Observable<any[]>{
      return this.http.get<any>(this.APIUrl+'/Graph');
    }

    postGraph(val:any){
      return this.http.post(this.APIUrl+'/Graph',val);
    }

    

  // postHistorialLogin(val:any){
  //   return this.http.post(this.APIUrl+'/historial/logins',val);
  // }  
 
}
