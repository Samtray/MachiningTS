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
    public class InventarioHistorialController : ApiController
    {

        public HttpResponseMessage Get()
        {
            List<InventarioHistorial> inventario = new List<InventarioHistorial>();
            DataTable dt = GetData("exec GetInvHistorial");
            
            for (int j = 0; j < dt.Rows.Count; j++)
            {
                InventarioHistorial inv = new InventarioHistorial
                {
                    id = Convert.ToInt32(dt.Rows[j]["id"]),
                    usuario = Convert.ToString(dt.Rows[j]["usuario"]),
                    herramienta = Convert.ToString(dt.Rows[j]["herramienta"]),
                    fecha = Convert.ToString(dt.Rows[j]["fecha"]),
                    altas = Convert.ToInt32(dt.Rows[j]["altas"]),
                    bajas = Convert.ToInt32(dt.Rows[j]["bajas"]),
                };

                inventario.Add(inv);
            }


            return Request.CreateResponse(HttpStatusCode.OK, inventario);
        }


        public string Post(InventarioHistorial inv)
        {
            try
            {
                string query = @"
                          exec InsertInvHistorial '"
                            + inv.usuario + @"'
                        ,'" + inv.herramienta + @"'
                        ,'" + inv.nombre + @"'
                        ,'" + inv.altas + @"'
                        ,'" + inv.bajas + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception e)
            {
                return e.ToString();
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
