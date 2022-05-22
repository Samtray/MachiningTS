import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ResumenComponent } from './resumen/resumen.component';
import { LoginComponent } from './auth/login/login.component';
import { CheckLoginGuard } from './guards/check-login.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { HistorialComponent } from './historial/historial.component';
import { EmpleadosComponent } from './empleados/empleados.component';
// import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { AdminCheckGuard } from './guards/admin-check.guard';

const routes: Routes = [
  {path: 'login', component:LoginComponent, canActivate:[CheckLoginGuard]},
  {path:'inventario',component:InventoryListComponent,canActivate:[LoggedInGuard]},
  // {path:'alertas',component:NotificacionesComponent},
  {path:'clientes',component:ClientesComponent, canActivate:[LoggedInGuard]},
  {path:'proveedores',component:ProveedoresComponent, canActivate:[LoggedInGuard]},
  {path:'resumen',component:ResumenComponent, canActivate:[LoggedInGuard]},
  {path:'perfil',component:PerfilComponent, canActivate:[LoggedInGuard]},
  {path:'historial',component:HistorialComponent,canActivate:[LoggedInGuard, AdminCheckGuard]},
  {path:'admin',component:EmpleadosComponent,canActivate:[LoggedInGuard,AdminCheckGuard]},
  {path: '', component:LoginComponent, canActivate:[CheckLoginGuard]},
  {
    path: '**', redirectTo: 'login' ,pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
