USE master;  
GO  
CREATE DATABASE MachiningTS  
ON   
( NAME = MachiningTS_dat,  
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\MachiningTS_dat.mdf',  
    SIZE = 10MB,  
    MAXSIZE = 50MB,  
    FILEGROWTH = 5MB )  
LOG ON  
( NAME = MachiningTS_log,  
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\MachiningTS_log.ldf',  
    SIZE = 5MB,  
    MAXSIZE = 25MB,  
    FILEGROWTH = 5MB ) ;  
GO  

use MachiningTS;

create table tipos(
	id int identity(1,1),
	nombre varchar (50) primary key
)

create table tipoHerramienta(
	id int identity(1,1),
	nombre varchar (50) primary key
)


create table empleados(
	id uniqueidentifier primary key default newid(),
	nombre varchar (100) not null,
	usuario varchar (100) not null unique, 
	contrasena varchar(MAX) not null,
	foto varchar (MAX) default 'api/foto2.jpg',
	rol varchar (50) not null,
	ultimaSesion varchar (100) default 'Sin primera Sesión.',
	totalMovimientos int default 0,
	ultimaModificacion varchar (MAX) default 'Sin modificaciones en el Inventario.',
	FOREIGN KEY (rol) REFERENCES roles(rol)

)

create table roles(
	id int identity (1,1),
	rol varchar (50) primary key
)

insert into roles values ('Admin')
insert into roles values ('Empleado')

create table empleadosBaja(
	id uniqueidentifier primary key default newid(),
	nombre varchar (100) not null,
	usuario varchar (100) not null,
	contrasena varchar(MAX) not null,
	foto varchar (MAX) default 'api/foto2.jpg',
	rol varchar (20) not null
)


create table proveedores (
	id int identity(1,1) primary key,
	foto varchar (MAX) default 'api/foto3.jpg',
	nombre varchar (500) not null,
	telefono varchar (20) default 'Sin Teléfono.',
	correo varchar (200) default 'Sin Correo.',
	direccion varchar (MAX) default 'Sin Dirección.'
)


create table inventario(
	id int identity(1,1) primary key,
	codigo varchar (100) default 'Sin Código.',
	grupo varchar(50) default 'Sin Categoría.',
	medida varchar (50) default 'Sin Medida.',
	filos varchar (20) default 'Sin Filos.',
	tipo varchar (50) default 'Sin Tipo.',
	noParte varchar (50) default 'Sin No. de Parte.',
	nombre varchar (500) not null,
	proveedor varchar (500) default 'Sin Proveedor.',
	ultimoMovimiento datetime default CURRENT_TIMESTAMP,
	actual int default 0,
	precio float default 0.00,
	descripcion varchar(MAX) default 'Sin descripción.',
	foto varchar (MAX) default 'api/foto.jpg',
	nivelInventario varchar (20),
	nivelBajo int default 5,
	nivelMedio int default 10,
	nivelAlto int default 20,
	FOREIGN KEY (tipo) REFERENCES tipos(nombre),
	FOREIGN KEY (grupo) REFERENCES tipoHerramienta(nombre)
)

--create table inventario(
--	id int identity(1,1) primary key,
--	codigo varchar (100) default 'Sin Código.',
--	grupo varchar (50),
--	medida varchar (50) default 'Sin Medida.',
--	filos varchar (20) default 'Sin Filos.',
--	tipo varchar (50) default 'Sin tipo.',
--	noParte varchar (50) default 'Sin No. de Parte.',
--	nombre varchar (500) not null,
--	proveedor varchar (500) default 'Sin Proveedor.',
--	ultimoMovimiento datetime default CURRENT_TIMESTAMP,
--	actual int default 0,
--	precio float default 0.00,
--	descripcion varchar(MAX) default 'Sin descripción.',
--	foto varchar (MAX) default 'api/foto.jpg',
--	nivelInventario varchar (20),
--	nivelBajo int default 5,
--	nivelMedio int default 10,
--	nivelAlto int default 20,
--	FOREIGN KEY (tipo) REFERENCES tipos(nombre),
--	FOREIGN KEY (grupo) REFERENCES tipoHerramienta(nombre)
--)

create table inventarioTransacciones(
	id int identity(1,1) primary key,
	usuario varchar (100) null,
	herramienta varchar (500) not null,
	fecha datetime default CURRENT_TIMESTAMP,
	altas int default 0,
	bajas int default 0
)



create table clientes (
	id int identity(1,1) primary key,
	nombre varchar (500) not null,
	telefono varchar (20) default 'Sin Teléfono.',
	correo varchar (200) default 'Sin Correo.',
	direccion varchar (MAX) default 'Sin Dirección.'
)


create table historial (
	id int identity(1,1) primary key,
	usuario varchar(100) not null,
	foto varchar (MAX),
	fecha varchar(500) not null,
	tipo varchar (50),
	contenido varchar (MAX)
)


create table notificaciones (
	id int identity(1,1) primary key,
	usuario varchar (100) not null,
	tipo varchar (100) not null,
	contenido varchar (MAX) not null,
	fecha datetime default CURRENT_TIMESTAMP
)

drop table notificaciones

------INSERTS-----------------------------------------------------------------
-----------------------------------------------------------------------------

insert into tipoHerramienta values ('Brocas')
insert into tipoHerramienta values ('Machuelos')
insert into tipoHerramienta values ('Cortadores')
insert into tipoHerramienta values ('Lijas')
insert into tipoHerramienta values ('Insertos')
select * from tipoHerramienta

insert into tipos values ('Sin tipo.');insert into tipos values ('UNICO');insert into tipos values ('FLAT');insert into tipos values ('BALL');insert into tipos values ('ICONICO');insert into tipos values ('HSS');insert into tipos values ('METRICO');insert into tipos values ('DORADO/TITANIO');insert into tipos values ('90 GRADOS');insert into tipos values ('GRANO 80');insert into tipos values ('CREMA');insert into tipos values ('INDICADOR');insert into tipos values ('MASKING TAPE');insert into tipos values ('GRANO 320');insert into tipos values ('GRANO 280');insert into tipos values ('GRANO 600');insert into tipos values ('GRANO 1000');insert into tipos values ('GRANO 1500');insert into tipos values ('GRANO 800');insert into tipos values ('GRANO 120');insert into tipos values ('GRANO 100');insert into tipos values ('DIENTE FINO');

insert into inventario values ('COR3/8-4F-FLAT-ESP', 'BRC', '3/8', '4', 'UNICO', default, 'CORTADOR', 'Argo Fusco', default, 1, default, default, default, 'Bajo', default, default, default)
select * from inventario 
----------------------------------------------

---------Agregar Inventario----------------------
alter procedure SumarInventario
@id int,
@inv int
as
update inventario set actual = ((select actual from inventario where id = @id) + @inv) where id = @id
if (select actual from inventario where id = @id) = 0
begin
update inventario set nivelInventario = 'Sin Inventario' where id = @id
end

if (select actual from inventario where id = @id) > 0 and  (select actual from inventario where id = @id) < (select nivelBajo from inventario where id = @id)
begin
update inventario set nivelInventario = 'Muy Bajo' where id = @id
end

if (select actual from inventario where id = @id) >= (select nivelBajo from inventario where id = @id) and (select actual from inventario where id = @id) < (select nivelMedio from inventario where id = @id)
begin
update inventario set nivelInventario = 'Bajo' where id = @id
end

if (select actual from inventario where id = @id) >= (select nivelMedio from inventario where id = @id) and (select actual from inventario where id = @id) < (select nivelAlto from inventario where id = @id)
begin
update inventario set nivelInventario = 'Medio' where id = @id
end

if (select actual from inventario where id = @id) >= (select nivelAlto from inventario where id = @id) 
begin
update inventario set nivelInventario = 'Alto' where id = @id
end


exec SumarInventario 2, 5

select actual from inventario where id = 2;



----------Restar Inventario-------------------------

alter procedure RestarInventario 
@id int,
@inv int
as 
DECLARE @err_message nvarchar(max)
IF ((select actual from inventario where id = @id) - @inv) < 0
    BEGIN
        SET @err_message = 'El inventario no puede ser menor a 0.'
        RAISERROR(@err_message, 16, 1)
    END;
ELSE
BEGIN
		update inventario set actual = ((select actual from inventario where id = @id) - @inv) where id = @id
END;

if (select actual from inventario where id = @id) = 0
begin
update inventario set nivelInventario = 'Sin Inventario' where id = @id
end

if (select actual from inventario where id = @id) > 0 and  (select actual from inventario where id = @id) < (select nivelBajo from inventario where id = @id)
begin
update inventario set nivelInventario = 'Muy Bajo' where id = @id
end

if (select actual from inventario where id = @id) >= (select nivelBajo from inventario where id = @id) and (select actual from inventario where id = @id) < (select nivelMedio from inventario where id = @id)
begin
update inventario set nivelInventario = 'Bajo' where id = @id
end

if (select actual from inventario where id = @id) >= (select nivelMedio from inventario where id = @id) and (select actual from inventario where id = @id) < (select nivelAlto from inventario where id = @id)
begin
update inventario set nivelInventario = 'Medio' where id = @id
end

if (select actual from inventario where id = @id) >= (select nivelAlto from inventario where id = @id) 
begin
update inventario set nivelInventario = 'Alto' where id = @id
end

exec SumarInventario 2, 10
select * from inventario
exec RestarInventario 2, 11

select * from inventario 
----------Get Inventario--------
create procedure GetInventario
as 
select * from inventario

-----------Seleccionar uno del inventario---------
create procedure SelectInventario
@id int
as
select * from inventario where id = @id;

exec SelectInventario 1

-----------Get todos clientes----------
create procedure GetClientes
as 
select * from clientes

-----------Select un cliente----------
alter procedure SelectCliente
@id int
as 
select * from clientes where id = @id

exec SelectCliente 4

---------Insert un Proveedor------------
create procedure InsertCliente
@nombre varchar (500),
@telefono varchar (20),
@correo varchar (200),
@direccion varchar (MAX)
as
insert into clientes values (@nombre, @telefono, @correo, @direccion)

exec InsertCliente 'Jorge Juan', '(664) 192-6612', 'juanjo@gmail.com', ' Gato Bronco 8202, Kino, 22217 Tijuana, B.C.'

---------Update Proveedor------------
alter procedure UpdateCliente
@id int,
@nombre varchar (500),
@telefono varchar (20),
@correo varchar (200),
@direccion varchar (MAX)
as
update clientes set nombre = @nombre, telefono = @telefono,
correo = @correo, direccion = @direccion where id  = @id

---------Borrar un Proveedor------------
alter procedure DeleteCliente
@id int
as
delete from clientes where id = @id

-----------Get todos proveedores----------
create procedure GetProveedores
as 
select * from proveedores

-----------Select un proveedor----------
create procedure SelectProveedor
@id int
as 
select * from proveedores where id = @id

exec SelectProveedor 4

---------Insert un Proveedor------------
create procedure InsertProveedor
@foto varchar (MAX),
@nombre varchar (500),
@telefono varchar (20),
@correo varchar (200),
@direccion varchar (MAX)
as
insert into proveedores values (@foto, @nombre, @telefono, @correo, @direccion)

---------Update Proveedor------------
create procedure UpdateProveedor
@id int,
@foto varchar (MAX),
@nombre varchar (500),
@telefono varchar (20),
@correo varchar (200),
@direccion varchar (MAX)
as
update proveedores set foto = @foto, nombre = @nombre, telefono = @telefono,
correo = @correo, direccion = @direccion where id  = @id

---------Borrar un Proveedor------------
create procedure DeleteProveedor
@id int
as
delete from proveedores where id = @id

-----------Get todos empleados----------
create procedure GetEmpleados
as 
select * from empleados

-----------Select un empleado----------
create procedure SelectEmpleado
@id uniqueidentifier
as 
select * from empleados where id = @id


-----------Insertar empleado----------
alter procedure InsertEmpleado
@nombre varchar (100),
@usuario varchar (100),
@contrasena varchar(MAX),
@foto varchar (MAX),
@rol varchar (20)
as
insert into empleados values (default, @nombre, @usuario, @contrasena, @foto, @rol, default, default, default)

-----------Update empleado----------
alter procedure UpdateEmpleado
@id uniqueidentifier,
@usuario varchar (100),
@contrasena varchar(MAX),
@foto varchar (MAX),
@rol varchar (20)
as
update empleados set usuario = @usuario, foto = @foto, rol = @rol where id = @id;

exec UpdateEmpleado '836AD556-C98C-43F5-AEC5-B59748DAB836', 'TestTS', '123', 'prueba', 'Admin' 

-----------Borrar empleado----------
create procedure DeleteEmpleado
@id uniqueidentifier
as
delete from empleados where id = @id

exec DeleteEmpleado '80C639FF-ACBE-448E-A7DA-27E47A85AD08'

select * from empleados


alter procedure InsertHerramientas
@codigo varchar (100), @grupo varchar (50), @medida varchar (50), @filos varchar (20), @tipo varchar (50), @noParte varchar (50),
@nombre varchar (500), @proveedor varchar (500), @actual int, @precio float, @descripcion varchar(MAX), @foto varchar (MAX),
@nivelInventario varchar (10), @nivelBajo int, @nivelMedio int, @nivelAlto int
as
insert into inventario values (@codigo, @grupo, @medida, @filos, @tipo, @noParte, @nombre, @proveedor, default,
@actual, @precio, @descripcion, @foto, @nivelInventario, @nivelBajo, @nivelMedio, @nivelAlto)

if @actual = 0
begin
update inventario set nivelInventario = 'Sin Inventario' where id = (SELECT @@IDENTITY)
end

if @actual > 0 and  @actual < (select nivelBajo from inventario where id = (SELECT @@IDENTITY))
begin
update inventario set nivelInventario = 'Muy Bajo' where id = (SELECT @@IDENTITY)
end

if @actual >= (select nivelBajo from inventario where id = (SELECT @@IDENTITY)) and @actual < (select nivelMedio from inventario where id = (SELECT @@IDENTITY))
begin
update inventario set nivelInventario = 'Bajo' where id = (SELECT @@IDENTITY)
end

if @actual >= (select nivelMedio from inventario where id = (SELECT @@IDENTITY)) and @actual < (select nivelAlto from inventario where id = (SELECT @@IDENTITY))
begin
update inventario set nivelInventario = 'Medio' where id = (SELECT @@IDENTITY)
end

if @actual >= (select nivelAlto from inventario where id = (SELECT @@IDENTITY)) 
begin
update inventario set nivelInventario = 'Alto' where id = (SELECT @@IDENTITY)
end

exec InsertHerramientas 'prueba', 'BRC', '1/8','6','UNICO', '22','Broca Loca','Targo Usco', '01/01/2021', 0, 30.56, 'Broca Prueba', 
'api/prueba.png', null, 5, 10, 20

select * from inventario


alter procedure UpdateHerramientas
@id int,
@codigo varchar (100),
@grupo varchar (50),
@medida varchar (50),
@filos varchar (20),
@tipo varchar (50) ,
@noParte varchar (50),
@nombre varchar (500),
@proveedor varchar (500),
--@ultimoMovimiento varchar (500),
@actual int ,
@precio float,
@descripcion varchar(MAX) ,
@foto varchar (MAX),
@nivelInventario varchar (10),
@nivelBajo int ,
@nivelMedio int ,
@nivelAlto int
as
update inventario set 
codigo = @codigo, 
grupo = @grupo, 
medida = @medida, 
filos = @filos, 
tipo = @tipo, 
noParte = @noParte, 
nombre = @nombre,
proveedor = @proveedor, 
ultimoMovimiento = default, 
actual = @actual, 
precio = @precio, 
descripcion = @descripcion, 
foto = @foto,
nivelInventario = @nivelInventario, 
nivelBajo = @nivelBajo, 
nivelMedio = @nivelMedio, 
nivelAlto = @nivelAlto where id = @id

if @actual = 0
begin
update inventario set nivelInventario = 'Sin Inventario' where id = @id
end

if @actual > 0 and  @actual < (select nivelBajo from inventario where id = @id)
begin
update inventario set nivelInventario = 'Muy Bajo' where id = @id
end

if @actual >= (select nivelBajo from inventario where id = @id) and @actual < (select nivelMedio from inventario where id = @id)
begin
update inventario set nivelInventario = 'Bajo' where id = @id
end

if @actual >= (select nivelMedio from inventario where id = @id) and @actual < (select nivelAlto from inventario where id = @id)
begin
update inventario set nivelInventario = 'Medio' where id = @id
end

if @actual >= (select nivelAlto from inventario where id = @id) 
begin
update inventario set nivelInventario = 'Alto' where id = @id
end

exec UpdateHerramientas 3, 'COR3/8-4F-FLAT-ESP', 'BRC', '3/8', '4', 'UNICO', 'Sin No. de Parte.',
'CORTADOR','Argo Tusco','02/09/2022 12:00:00', 3, 10.2,'Sin descripción.', 'api/foto.jpg', 'Bajo', 1, 2, 3

select * from inventario

----Borrar Herramienta----
create procedure DeleteHerramienta
@id int 
as 
delete from inventario where id = @id;


exec InsertNotification 'Admin'
select * from notificaciones


select * from historial
select * from empleados
select * from inventario

exec InsertEmpleado 'Jhon Titor', 'Empleado', '$2a$10$kvYeAEyqt1uZLS8lYXM5y.XPZMgRwlzAbA8uBw35FtcfmQOAY79iW', 'https://localhost:44304/img/20210929_104500962u2.jpg', 'Empleado'
exec InsertEmpleado 'Juan Carlos', 'Admin', '$2a$10$kvYeAEyqt1uZLS8lYXM5y.XPZMgRwlzAbA8uBw35FtcfmQOAY79iW', 'https://localhost:44304/img/20210929_104500962u2.jpg', 'Admin'

truncate table empleados

exec SelectEmpleadoPorUsuario 'Admin'

---------------Insertar Categoria-------------
create procedure InsertCategoria
@cat varchar (50)
as
insert into tipoHerramienta values (@cat)

---------------Update Categoria-------------
alter procedure UpdateCategoria 
@cat varchar (50),
@cat2 varchar (50)
as
update tipoHerramienta set id = @cat2 where id = @cat

exec InsertCategoria 'Brocas'
exec UpdateCategoria 'Brocas', 'Fresas'
select * from tipoHerramienta

-----Get Categorias--------
alter procedure GetCategorias
as
select * from tipoHerramienta;

-----Select Categorias--------
alter procedure SelectCategorias
@cat varchar (50)
as
select * from tipoHerramienta where id = @cat 


---------------Insertar Tipo-------------
create procedure InsertTipo
@tip varchar (50)
as
insert into tipos values (@tip)

---------------Update Tipo-------------
create procedure UpdateTipo 
@tip varchar (50),
@tip2 varchar (50)
as
update tipos set nombre = @tip2 where nombre = @tip

exec InsertCategoria 'Brocas'
exec UpdateCategoria 'Brocas', 'Fresas'
select * from tipoHerramienta

-----Get Tipos--------
alter procedure GetTipos
as
select * from tipos;




-------Cambiar Contraseña-------------
alter procedure CambiarContra
@usuario varchar(100),
@contrasena varchar(MAX)
as 
update empleados set contrasena = @contrasena where usuario = @usuario

---Update Fotografía Herraminta----------
alter procedure InventarioFoto
@id int,
@foto varchar(MAX)
as 
update inventario set foto = @foto where id = @id

---Update Fotografía Perfil----------
create procedure PerfilFoto
@id uniqueidentifier,
@foto varchar(MAX)
as 
update empleados set foto = @foto where id = @id

---Update Fotografía Provedor----------
create procedure ProveedoresFoto
@id uniqueidentifier,
@foto varchar(MAX)
as 
update proveedores set foto = @foto where id = @id


---Update Fotografía Clientes----------
create procedure ClientesFoto
@id uniqueidentifier,
@foto varchar(MAX)
as 
update clientes set foto = @foto where id = @id


---Update Fotografía Empleados----------
create procedure EmpleadosFoto
@id uniqueidentifier,
@foto varchar(MAX)
as 
update empleados set foto = @foto where id = @id



exec PerfilFoto 'D1E8EDD8-1496-4B58-BD96-FD23373EAAD1', 'https://localhost:44304/img/20210923_062737739u1.jpg'

exec CambiarContra 'Admin', '123'
exec CambiarContra 'Empleado', '$2a$10$kvYeAEyqt1uZLS8lYXM5y.XPZMgRwlzAbA8uBw35FtcfmQOAY79iW'

select * from empleados
select * from inventario

----Update Inicio Sesion
create procedure LoginTimestamp
@usuario varchar (100)
as
update empleados set ultimaSesion = CURRENT_TIMESTAMP where usuario = @usuario

select * from empleados



------Get Inventario Historial----------
create procedure GetInvHistorial
as
select * from inventarioTransacciones

------Insertar Historial Inventario----
alter procedure InsertInvHistorial
@usuario varchar (100),
@herramienta varchar (500),
@nombre varchar (500),
@altas int,
@bajas int
as
insert into inventarioTransacciones values (@usuario, @herramienta, default, @altas, @bajas)
if @altas != 0
begin
	if @altas = 1
		begin
			update empleados set ultimaModificacion = CONCAT('Agregó ', @altas, ' pieza al inventario ', @herramienta, '.') where usuario = @usuario
		end
	else
		begin
			update empleados set ultimaModificacion = CONCAT('Agregó ', @altas, ' piezas al inventario ', @herramienta, '.') where usuario = @usuario
		end
end
if @bajas != 0
begin
	if @bajas = 1
		begin
			update empleados set ultimaModificacion = CONCAT('Restó ', @bajas, ' pieza al inventario ', @herramienta, '.') where usuario = @usuario	
		end
	else
		begin
			update empleados set ultimaModificacion = CONCAT('Restó ', @bajas, ' piezas al inventario ', @herramienta, '.') where usuario = @usuario	
		end
end
select * from inventarioTransacciones

-----------Select un empleado por usuario----------
alter procedure SelectEmpleadoUsuario
@usuario varchar(100)
as  
update empleados set totalMovimientos = (select count(*) from inventarioTransacciones where usuario = @usuario) where usuario = @usuario
select * from empleados where usuario = @usuario; 

exec SelectEmpleadoUsuario 'Empleado'

select * from inventarioTransacciones
select * from empleados
select * from notificaciones



--------Insertar Login Historial----------
alter procedure InsertLoginHistorial
@usuario varchar (100)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Inicio de Sesión', CONCAT('El usuario ', @usuario , ' inició sesión.'))

exec InsertLoginHistorial 'FabianTS'

select * from historial

--------Insertar Empleado Historial----------
create procedure InsertEmpleadoHistorial
@usuario varchar (100),
@empleado varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Registro',CONCAT('El usuario ', @usuario , ' agregó el empleado ' , @empleado , '.'))

--------Update Cliente Historial----------
create procedure UpdateEmpleadoHistorial
@usuario varchar (100),
@empleado varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Modificación',CONCAT('El usuario ', @usuario , ' modificó el empleado ' , @empleado , '.'))

--------Delete Cliente Historial----------
create procedure DeleteEmpleadoHistorial
@usuario varchar (100),
@empleado varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Bajas',CONCAT('El usuario ', @usuario , ' eliminó el empleado ' , @empleado , '.'))

--------Insertar Cliente Historial----------
alter procedure InsertClienteHistorial
@usuario varchar (100),
@cliente varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Registro',CONCAT('El usuario ', @usuario , ' agregó el cliente ' , @cliente , '.'))

exec InsertClienteHistorial 'FabianTS', 'José Hernandéz'

--------Update Cliente Historial----------
alter procedure UpdateClienteHistorial
@usuario varchar (100),
@cliente varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Modificación',CONCAT('El usuario ', @usuario , ' modificó el cliente ' , @cliente , '.'))

exec UpdateClienteHistorial 'FabianTS', 'José Hernandéz'

--------Delete Cliente Historial----------
alter procedure DeleteClienteHistorial
@usuario varchar (100),
@cliente varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Bajas',CONCAT('El usuario ', @usuario , ' eliminó el cliente ' , @cliente , '.'))

exec DeleteClienteHistorial 'FabianTS', 'José Hernandéz'

--------Insert Proveedor Historial----------
alter procedure InsertProveedorHistorial
@usuario varchar (100),
@proveedor varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Registro',CONCAT('El usuario ', @usuario , ' agregó el proveedor ' , @proveedor , '.'))

exec InsertProveedorHistorial 'FabianTS', 'José Hernandéz', '01/06/2021'

--------Update Cliente Historial----------
alter procedure UpdateProveedorHistorial
@usuario varchar (100),
@proveedor varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Modificación',CONCAT('El usuario ', @usuario , ' modificó el proveedor ' , @proveedor , '.'))


exec UpdateProveedorHistorial 'FabianTS', 'José Hernandéz', '01/06/2021'

--------Delete Cliente Historial----------
alter procedure DeleteProveedorHistorial
@usuario varchar (100),
@proveedor varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Bajas',CONCAT('El usuario ', @usuario , ' eliminó el proveedor ' , @proveedor ,'.'))


exec DeleteProveedorHistorial 'FabianTS', 'José Hernandéz', '01/06/2021'


--------Insert Herramienta Historial----------
alter procedure InsertHerramientaHistorial
@usuario varchar (100),
@herramienta varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Registro',CONCAT('El usuario ', @usuario , ' agregó ' , @herramienta , ' al inventario', '.'))

select * from historial
--------Update Herramienta Historial----------
alter procedure UpdateHerramientaHistorial
@usuario varchar (100),
@herramienta varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Modificación',CONCAT('El usuario ', @usuario , ' modificó la herramienta ' , @herramienta,'.'))

exec UpdateHerramientaHistorial 'Admin','Auto Rojo Nissan Versa'

--------Delete Herramienta Historial----------
alter procedure DeleteHerramientaHistorial
@usuario varchar (100),
@herramienta varchar (500)
as
insert into historial values (@usuario, (select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Bajas',CONCAT('El usuario ', @usuario , ' eliminó la herramienta ' , @herramienta ,'.'))



--------Altas Herramientas Historial----------
alter procedure AltaHerramientaHistorial
@usuario varchar (500),
@cantidad int,
@herramienta varchar (500)
as
if @cantidad = 1
begin
insert into historial values (@usuario,(select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP, 'Suma',CONCAT('El usuario ', @usuario + ' registró ' , @cantidad , ' altas de ', @herramienta,'.'))
end
else
begin
insert into historial values (@usuario,(select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP, 'Suma',CONCAT('El usuario ', @usuario + ' registró ' , @cantidad , ' altas de ', @herramienta,'.'))
end
--------Bajas Herramientas Historial----------
alter procedure BajasHerramientaHistorial
@usuario varchar (500),
@cantidad int,
@herramienta varchar (500)
as
if @cantidad = 1
begin
insert into historial values (@usuario,(select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Resta',CONCAT('El usuario ', @usuario + ' registró ' , @cantidad , ' baja de ', @herramienta,'.'))
end
else
begin
insert into historial values (@usuario,(select foto from empleados where usuario = @usuario), CURRENT_TIMESTAMP,'Resta',CONCAT('El usuario ', @usuario + ' registró ' , @cantidad , ' bajas de ', @herramienta,'.'))
end
-----LOGIN----------
alter procedure SelectEmpleadoPorUsuario
@usuario varchar (100)
as
select * from empleados where usuario = @usuario COLLATE SQL_Latin1_General_CP1_CS_AS;

ALTER TABLE empleados
ADD UNIQUE (usuario);

select * from historial
truncate table historial
drop table historial
select * from empleados


create procedure NukeHistorial
as
truncate table historial

------------Get Historial Completo---------
alter procedure GetHistorial
as
select * from historial
order by id DESC

drop procedure GetNotificacionesTop5
----Get Notificaciones-----------
create procedure GetNotificacionesPorUsuario
@usuario varchar(100)
as
select * from notificaciones where usuario = @usuario

insert into notificaciones values ('Prueba', default)
----------Generar Notificaciones--------
alter procedure InsertNotification
@usuario varchar (500)
as
declare @sin_int as int = (select COUNT(*)from inventario where nivelInventario = 'Sin Inventario')
declare @bajo_int as int = (select COUNT(*)from inventario where nivelInventario = 'Bajo')
declare @muybajo_int as int = (select COUNT(*)from inventario where nivelInventario = 'Muy Bajo')
declare @sin as varchar(MAX) = (SELECT CONVERT(varchar(MAX), @sin_int)) 
declare @bajo as varchar(MAX) = (SELECT CONVERT(varchar(MAX), @bajo_int)) 
declare @muybajo as varchar(MAX) = (SELECT CONVERT(varchar(MAX), @muybajo_int)) 
delete from notificaciones where usuario = @usuario
if @sin_int > 0
begin
insert into notificaciones values (@usuario, 'SI', @sin + ' herramienta(s) se encuentra(n) sin inventario.', default)
end
if @bajo_int > 0
begin
insert into notificaciones values (@usuario, 'B', @bajo + ' herramienta(s) se encuentra(n) en nivel Bajo.', default)
end
if @muybajo_int > 0
begin
insert into notificaciones values (@usuario, 'MB', @muybajo + ' herramienta(s) se encuentra(n) en nivel Muy Bajo.', default)
end

-----------------Borrar notificacion-------
create procedure DeleteNotificacion
@id int
as
delete from notificaciones where id = @id
--------------------------------
select * from notificaciones 
truncate table notificaciones
select * from inventario
select * from empleados


--------Delete Tipos---------
alter procedure DeleteTipos
@tip int 
as 
DECLARE @err_message nvarchar(max)
DECLARE @item varchar(50) = (select nombre from tipos where id = @tip)
IF EXISTS (SELECT * FROM inventario WHERE tipo = @item) 
BEGIN
		SET @err_message = 'El tipo se encuentra vinculado a una herramienta.'
        RAISERROR(@err_message, 16, 1)
END
ELSE
BEGIN
delete from tipos where id = @tip
END

select * from tipos
exec DeleteTipos 1
--------Delete Categorias---------
alter procedure DeleteCategoria
@cat int
as 
DECLARE @err_message nvarchar(max)
DECLARE @item varchar(50) = (select nombre from tipoHerramienta where id = @cat)
IF EXISTS (SELECT * FROM inventario WHERE grupo = @item) 
BEGIN
		SET @err_message = 'El grupo se encuentra vinculado a una herramienta.'
        RAISERROR(@err_message, 16, 1)
END
ELSE
BEGIN
delete from tipoHerramienta where id = @cat
END

-----------Update empleado----------
alter procedure UpdateEmpleado
@id uniqueidentifier,
@nombre varchar (100),
@usuario varchar (100),
@foto varchar (MAX),
@rol varchar (20)
as
update empleados set nombre = @nombre, usuario = @usuario, foto = @foto, rol = @rol where id = @id;

-----------------

alter procedure NewNotifications
as
select * from inventario where nivelInventario = 'Sin Inventario' or nivelInventario = 'Muy Bajo' or nivelInventario = 'Bajo'
order by nivelInventario desc

----------------

select * from inventarioTransacciones
truncate table inventarioTransacciones
select * from empleados

alter procedure UserCheck
@user varchar(100)
as
DECLARE @err_message nvarchar(max)
IF EXISTS (SELECT * FROM empleados WHERE usuario = @user) 
BEGIN
		SET @err_message = 'Ese usuario ya ha sido tomado.'
        RAISERROR(@err_message, 16, 1)
END


alter procedure GrupoCheck
@grupo varchar(50)
as
DECLARE @err_message nvarchar(max)
IF EXISTS (SELECT * FROM tipoHerramienta WHERE nombre = @grupo) 
BEGIN
		SET @err_message = 'Grupo ya existente.'
        RAISERROR(@err_message, 16, 1)
END


create procedure TipoCheck
@tipo varchar(100)
as
DECLARE @err_message nvarchar(max)
IF EXISTS (SELECT * FROM tipos WHERE nombre = @tipo) 
BEGIN
		SET @err_message = 'Tipo ya existente.'
        RAISERROR(@err_message, 16, 1)
END

create procedure DateRange
@start datetime,
@end datetime
as
select * from inventarioTransacciones where cast(fecha as date) BETWEEN @start and @end

alter procedure GraphCounter
as
SELECT
    (select COUNT(*) from proveedores) as prov,
    (select COUNT(*) from clientes) as clie,
	(select COUNT(*) from empleados) as emps,
	(select COUNT(*) from inventario) as herr

INTO #GraphCount --- temporary table
select * from #GraphCount

exec GraphCounter

select * from Empleados
select * from inventarioTransacciones
truncate table inventarioTransacciones

-- Truncar tablas
EXEC sp_MSForEachTable 'DISABLE TRIGGER ALL ON ?'
GO
EXEC sp_MSForEachTable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'
GO
EXEC sp_MSForEachTable 'DELETE FROM ?'
GO
EXEC sp_MSForEachTable 'ALTER TABLE ? CHECK CONSTRAINT ALL'
GO
EXEC sp_MSForEachTable 'ENABLE TRIGGER ALL ON ?'
GO

--Borrar tablas
EXEC sp_MSForEachTable 'DISABLE TRIGGER ALL ON ?'
GO
EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'
GO
EXEC sp_MSforeachtable 'DROP TABLE ?'
GO
EXEC sp_MSForEachTable 'ALTER TABLE ? CHECK CONSTRAINT ALL'
GO
EXEC sp_MSForEachTable 'ENABLE TRIGGER ALL ON ?'
GO