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
    public class NotificacionesController : ApiController
    {
        public HttpResponseMessage Get(string usuario) { 
        List<Notificacion> notificaciones = new List<Notificacion>();
        DataTable dt = GetData(string.Format("exec GetNotificacionesPorUsuario '{0}'", usuario));

            for (int j = 0; j < dt.Rows.Count; j++)
            {
                Notificacion not = new Notificacion
                {
                    id = Convert.ToInt32(dt.Rows[j]["id"]),
                    tipo = Convert.ToString(dt.Rows[j]["tipo"]),
                    contenido = Convert.ToString(dt.Rows[j]["contenido"]),
                    fecha = Convert.ToString(dt.Rows[j]["fecha"]),
                };

                notificaciones.Add(not);
            }

            return Request.CreateResponse(HttpStatusCode.OK, notificaciones);

        }

        public HttpResponseMessage Get()
        {
            List<Herramienta> herramientas = new List<Herramienta>();
            DataTable dt = GetData("exec NewNotifications");

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
                };

                herramientas.Add(herramienta);
            }

            return Request.CreateResponse(HttpStatusCode.OK, herramientas);
        }

        public string Post(NotificacionInsert ntf) {
            try
            {
                string query = @"
                          exec InsertNotification '"
                            + ntf.usuario + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }
        }

        public string Delete(int id)
        {
            try
            {
                string query = string.Format("exec DeleteNotificacion '{0}'", id);
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
