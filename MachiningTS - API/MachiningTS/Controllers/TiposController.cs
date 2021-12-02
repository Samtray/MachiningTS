using MachiningTS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MachiningTS.Controllers
{
    public class TiposController : ApiController
    {
        public HttpResponseMessage Get()
        {
            List<Categoria> categorias = new List<Categoria>();
            DataTable dt = GetData("exec GetTipos");

            for (int j = 0; j < dt.Rows.Count; j++)
            {
                Categoria cat = new Categoria
                {
                    id = Convert.ToInt32(dt.Rows[j]["id"]),
                    nombre = Convert.ToString(dt.Rows[j]["nombre"])
                };

                categorias.Add(cat);
            }


            return Request.CreateResponse(HttpStatusCode.OK, categorias);
        }

        public HttpResponseMessage Get(int id)
        {
            List<Categoria> categorias = new List<Categoria>();
            DataTable dt = GetData(string.Format("exec SelectTipos '{0}'", id));
            Categoria cat = new Categoria
            {
                id = Convert.ToInt32(dt.Rows[0]["id"]),
                nombre = Convert.ToString(dt.Rows[0]["nombre"])
            };

            categorias.Add(cat);

            return Request.CreateResponse(HttpStatusCode.OK, categorias);
        }

        public string Post(Categoria cat)
        {
            try
            {
                try
                {
                    string query2 = @"
                          exec TipoCheck '"
                            + cat.nombre + @"'";
                    DataTable dt2 = GetData(query2);
                }
                catch (Exception e)
                {
                    return e.Message;
                }
                string query = @"
                          exec InsertTipo '"
                            + cat.nombre + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }

        }

        public string Put(InsertHistorial2 cat)
        {
            try
            {
                string query = @"
                          exec UpdateTipo '"
                            + cat.uno + @"'
                        ,'" + cat.dos + @"'
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
                string query = string.Format("exec DeleteTipos '{0}'", id);
                GetData(query);
                return "Borrado exitosamente.";
            }
            catch (Exception e)
            {
                return e.Message;
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
