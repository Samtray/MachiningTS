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
    public class EmpleadosController : ApiController
    {

        public HttpResponseMessage Get()
        {
            List<Empleado> empleados = new List<Empleado>();
            DataTable dt = GetData("exec GetEmpleados");
            
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                Empleado emp = new Empleado
                {
                    id = Convert.ToString(dt.Rows[i]["id"]),
                    nombre = Convert.ToString(dt.Rows[i]["nombre"]),
                    usuario = Convert.ToString(dt.Rows[i]["usuario"]),
                    foto = Convert.ToString(dt.Rows[i]["foto"]),
                    rol = Convert.ToString(dt.Rows[i]["rol"]),
                    ultimaSesion = Convert.ToString(dt.Rows[i]["ultimaSesion"]),
                    totalMovimientos = Convert.ToInt32(dt.Rows[i]["totalMovimientos"]),
                    ultimaModificacion = Convert.ToString(dt.Rows[i]["ultimaModificacion"]),
                };

                empleados.Add(emp);
            }


            return Request.CreateResponse(HttpStatusCode.OK, empleados);
        }

        /*public HttpResponseMessage Get(string id)
        {
                List<Empleado> empleados = new List<Empleado>();
                DataTable dt = GetData(string.Format("exec SelectEmpleado '{0}'", id));
                Empleado emp = new Empleado
                {
                    id = Convert.ToString(dt.Rows[0]["id"]),
                    nombre = Convert.ToString(dt.Rows[0]["nombre"]),
                    usuario = Convert.ToString(dt.Rows[0]["usuario"]),
                    contrasena = Convert.ToString(dt.Rows[0]["contrasena"]),
                    foto = Convert.ToString(dt.Rows[0]["foto"]),
                    rol = Convert.ToString(dt.Rows[0]["rol"]),
                    ultimaSesion = Convert.ToString(dt.Rows[0]["ultimaSesion"]),
                    totalMovimientos = Convert.ToInt32(dt.Rows[0]["totalMovimientos"]),
                    ultimaModificacion = Convert.ToString(dt.Rows[0]["ultimaModificacion"]),
                
                };
            empleados.Add(emp);

            return Request.CreateResponse(HttpStatusCode.OK, empleados);
        }

        [Route("api/empleados/usuario")]
        [HttpGet]*/
        public HttpResponseMessage Get(string id)
        {
            List<Empleado> empleados = new List<Empleado>();
            DataTable dt = GetData(string.Format("exec SelectEmpleadoUsuario '{0}'", id));
            Empleado emp = new Empleado
            {
                id = Convert.ToString(dt.Rows[0]["id"]),
                nombre = Convert.ToString(dt.Rows[0]["nombre"]),
                usuario = Convert.ToString(dt.Rows[0]["usuario"]),
                foto = Convert.ToString(dt.Rows[0]["foto"]),
                rol = Convert.ToString(dt.Rows[0]["rol"]),
                ultimaSesion = Convert.ToString(dt.Rows[0]["ultimaSesion"]),
                totalMovimientos = Convert.ToInt32(dt.Rows[0]["totalMovimientos"]),
                ultimaModificacion = Convert.ToString(dt.Rows[0]["ultimaModificacion"]),

            };
            empleados.Add(emp);

            return Request.CreateResponse(HttpStatusCode.OK, empleados);
        }

        public string Post(Empleado emp)
        {
            try
            {
                try {
                    string query2 = @"
                          exec UserCheck '"
                            + emp.usuario + @"'";
                    DataTable dt2 = GetData(query2);
                } 
                catch (Exception e)
                {
                    return e.Message;
                }
                string query = @"
                          exec InsertEmpleado '"
                            + emp.nombre + @"'
                        ,'" + emp.usuario + @"'
                        ,'" + emp.contrasena + @"'
                        ,'" + emp.foto + @"'
                        ,'" + emp.rol + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }

        }

        public string Put(Empleado emp)
        {
            try
            {
                string query = @"
                          exec UpdateEmpleado '"
                            + emp.id + @"'
                        ,'" + emp.nombre + @"'
                        ,'" + emp.usuario + @"'
                        ,'" + emp.foto + @"'
                        ,'" + emp.rol + @"'
                        ";
                DataTable dt = GetData(query);
                return "Modificación exitosa.";
            }
            catch (Exception)
            {
                return "Modificación fallida.";
            }

        }

        public string Delete(string id)
        {
            try
            {
                string query = string.Format("exec DeleteEmpleado '{0}'", id);
                GetData(query);
                return "Borrado exitosamente.";
            }
            catch (Exception)
            {
                return "El borrado ha fallado.";
            }

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
