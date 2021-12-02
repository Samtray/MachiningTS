using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MachiningTS.Models;
namespace MachiningTS.Controllers
{
    public class MachiningTSController : ApiController
    {
       public HttpResponseMessage Get() {
            List<Herramienta> herramientas = new List<Herramienta>();
            List<ListaProveedores> proveedores = new List<ListaProveedores>();
            List<ListaClientes> clientes = new List<ListaClientes>();
            DataTable p = GetData("exec GetProveedores");
            DataTable dt = GetData("exec GetInventario");
            DataTable c = GetData("exec GetClientes");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                Herramienta herramienta = new Herramienta
                {
                    id = Convert.ToInt32(dt.Rows[i]["id"]),
                    codigo = Convert.ToString(dt.Rows[i]["codigo"]),
                    grupo = Convert.ToString(dt.Rows[i]["grupo"]),
                    medida = Convert.ToString(dt.Rows[i]["medida"]),
                    filos = Convert.ToString(dt.Rows[i]["filos"]),
                    tipo = Convert.ToString(dt.Rows[i]["tipo"]),
                    noParte = Convert.ToString(dt.Rows[i]["noParte"]),
                    nombre = Convert.ToString(dt.Rows[i]["nombre"]),
                    proveedor = Convert.ToString(dt.Rows[i]["proveedor"]),
                    ultimoMovimiento = Convert.ToDateTime(dt.Rows[i]["ultimoMovimiento"]),
                    actual = Convert.ToInt32(dt.Rows[i]["actual"]),
                    precio = Convert.ToDouble(dt.Rows[i]["precio"]),
                    descripcion = Convert.ToString(dt.Rows[i]["descripcion"]),
                    foto = Convert.ToString(dt.Rows[i]["foto"]),
                    nivelBajo = Convert.ToInt32(dt.Rows[i]["nivelBajo"]),
                    nivelMedio = Convert.ToInt32(dt.Rows[i]["nivelMedio"]),
                    nivelAlto = Convert.ToInt32(dt.Rows[i]["nivelAlto"]),
                    nivelInventario = Convert.ToString(dt.Rows[i]["nivelInventario"]),
                    //current = sensorCurrentAlcohol(Convert.ToString(dt.Rows[i]["status"])),
                };


 
                herramientas.Add(herramienta);
            }
            for (int j = 0; j < p.Rows.Count; j++)
            {
                ListaProveedores prov = new ListaProveedores
                {
                    id = Convert.ToInt32(p.Rows[j]["id"]),
                    foto = Convert.ToString(p.Rows[j]["foto"]),
                    nombre = Convert.ToString(p.Rows[j]["nombre"]),
                    telefono = Convert.ToString(p.Rows[j]["telefono"]),
                    correo = Convert.ToString(p.Rows[j]["correo"]),
                    direccion = Convert.ToString(p.Rows[j]["direccion"]),
  
                };

                proveedores.Add(prov);
            }
            for (int i = 0; i < c.Rows.Count; i++)
            {
                ListaClientes clie = new ListaClientes
                {
                    id = Convert.ToInt32(c.Rows[i]["id"]),
                    nombre = Convert.ToString(c.Rows[i]["nombre"]),
                    telefono = Convert.ToString(c.Rows[i]["telefono"]),
                    correo = Convert.ToString(c.Rows[i]["correo"]),
                    direccion = Convert.ToString(c.Rows[i]["direccion"]),

                };

                clientes.Add(clie);
            }

            Inventario inv = new Inventario
            {
                herramientas = herramientas
            };

            MachiningPadre mts = new MachiningPadre
            {
                inventario = inv,
                proveedores = proveedores,
                clientes = clientes
            };

            return Request.CreateResponse(HttpStatusCode.OK, mts);
        }
        private DataTable GetData(string query)
        {
            string conString = ConfigurationManager.ConnectionStrings["MachiningTSDB"].ConnectionString;
            SqlCommand cmd = new SqlCommand(query);
            using (SqlConnection con = new SqlConnection(conString))
            {
                using (SqlDataAdapter sda = new SqlDataAdapter())
                {
                    cmd.Connection = con;
                    sda.SelectCommand = cmd;
                    using (DataTable dt = new DataTable())
                    {
                        sda.Fill(dt);
                        return dt;

                    }
                }
            }
        }
    }
    
}
