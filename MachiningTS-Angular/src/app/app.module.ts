import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { ApiService } from './api.service';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ResumenComponent } from './resumen/resumen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { CdkDetailRowDirective } from './cdk-detail-row.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgregarEditarComponent } from './inventory-list/agregar-editar/agregar-editar.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { TiposGruposComponent } from './inventory-list/tipos-grupos/tipos-grupos.component';
import { LoginComponent } from './auth/login/login.component';
import { LoginModule } from './auth/login/login.module';
import { PerfilComponent } from './perfil/perfil.component';
import { HistorialComponent } from './historial/historial.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { AgregarEmpleadosComponent } from './empleados/agregar-empleados/agregar-empleados.component';
import { AgregarProveedorComponent } from './proveedores/agregar-proveedor/agregar-proveedor.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { SpinnerModule } from './loading/spinner/spinner.module'
// import { SpinnerInterceptor } from './loading/interceptors/spinner.interceptor';
import { EditarEmpleadoComponent } from './empleados/editar-empleado/editar-empleado.component';
import { NuevacontraComponent } from './empleados/nuevacontra/nuevacontra.component';
import { AgregarClienteComponent } from './clientes/agregar-cliente/agregar-cliente.component';

@NgModule({
  declarations: [
    AppComponent,
    InventoryListComponent,
    ProveedoresComponent,
    ClientesComponent,
    ResumenComponent,
    CdkDetailRowDirective,
    AgregarEditarComponent,
    TiposGruposComponent,
    PerfilComponent,
    HistorialComponent,
    EmpleadosComponent,
    AgregarEmpleadosComponent,
    AgregarProveedorComponent,
    NotificacionesComponent,
    EditarEmpleadoComponent,
    NuevacontraComponent,
    AgregarClienteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    LoginModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  // providers: [ApiService, {provide:HTTP_INTERCEPTORS, useClass:SpinnerInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
