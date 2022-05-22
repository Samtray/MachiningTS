export type Roles = 'Empleado' | 'Admin' | 'Null'

export interface User{
    usuario: string;
    contrasena: string;
    check: boolean;
}

export interface CambiarContra{
    uno: string;
    dos: string;
}

export interface Contra{
    contrasena:string;
}

export interface UserResponse{
    usuario: string,
    rol: Roles,
    accessToken: string,
}
