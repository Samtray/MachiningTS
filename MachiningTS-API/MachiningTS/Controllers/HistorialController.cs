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
    public class HistorialController : ApiController
    {
        public HttpResponseMessage Get()
        {
            List<Historial> historial = new List<Historial>();
            DataTable dt = GetData("exec GetHistorial");

            for (int j = 0; j < dt.Rows.Count; j++)
            {
                Historial his = new Historial
                {
                    id = Convert.ToInt32(dt.Rows[j]["id"]),
                    usuario = Convert.ToString(dt.Rows[j]["usuario"]),
                    foto = Convert.ToString(dt.Rows[j]["foto"]),
                    fecha = Convert.ToString(dt.Rows[j]["fecha"]),
                    tipo = Convert.ToString(dt.Rows[j]["tipo"]),
                    contenido = Convert.ToString(dt.Rows[j]["contenido"]),
                };

                historial.Add(his);
            }

            return Request.CreateResponse(HttpStatusCode.OK, historial);

        }

        [Route("api/historial/nuke")]
        [HttpGet]
        public HttpResponseMessage NukeHistorial()
        {
            try
            {
                DataTable dt = GetData("exec NukeHistorial");
                return Request.CreateResponse(HttpStatusCode.OK, "Eliminado exitoso.");
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Algo salio mal.");


            }
        }

        [Route("api/historial/logins")]
        [HttpPost]
        public string postLogins(string his)
        {
            try
            {
                string query = @"
                          exec InsertLoginHistorial '"
                            + his + @"'";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/clienteinsert")]
        [HttpPost]
        public string postCliente(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec InsertClienteHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/clienteupdate")]
        [HttpPost]
        public string postClienteUpdate(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec UpdateClienteHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/clientedelete")]
        [HttpPost]
        public string postClienteDelete(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec DeleteClienteHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/proveedorinsert")]
        [HttpPost]
        public string postProveedor(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec InsertProveedorHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/proveedorupdate")]
        [HttpPost]
        public string postProveedorUpdate(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec UpdateProveedorHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/proveedordelete")]
        [HttpPost]
        public string postProveedorDelete(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec DeleteProveedorHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }
        
        [Route("api/historial/empleadoinsert")]
        [HttpPost]
        public string postEmpleado(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec InsertEmpleadoHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/empleadoupdate")]
        [HttpPost]
        public string postEmpleadoUpdate(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec UpdateEmpleadoHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/empleadodelete")]
        [HttpPost]
        public string postEmpleadoDelete(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec DeleteEmpleadoHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/herramientainsert")]
        [HttpPost]
        public string postHerramienta(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec InsertHerramientaHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/herramientaupdate")]
        [HttpPost]
        public string postHerramientaUpdate(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec UpdateHerramientaHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/herramientadelete")]
        [HttpPost]
        public string postHerramientaDelete(InsertHistorial2 his)
        {
            try
            {
                string query = @"
                          exec DeleteHerramientaHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/altaherramienta")]
        [HttpPost]
        public string postHerramientaAlta(InsertHistorial3 his)
        {
            try
            {
                string query = @"
                          exec AltaHerramientaHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ,'" + his.tres + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        [Route("api/historial/bajaherramienta")]
        [HttpPost]
        public string postHerramientaBaja(InsertHistorial3 his)
        {
            try
            {
                string query = @"
                          exec BajasHerramientaHistorial '"
                            + his.uno + @"'
                        ,'" + his.dos + @"'
                        ,'" + his.tres + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
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
