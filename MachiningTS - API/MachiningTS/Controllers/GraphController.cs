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
    public class GraphController : ApiController
    {
    
        public HttpResponseMessage Get()
        {

            DataTable dt = GetData("exec GraphCounter");

            /*for (int i = 0; i < dt.Rows.Count; i++)
            {*/
                Counter counter = new Counter
                {
                    emps = Convert.ToInt32(dt.Rows[0]["emps"]),
                    prov = Convert.ToInt32(dt.Rows[0]["prov"]),
                    clie = Convert.ToInt32(dt.Rows[0]["clie"]),
                    herr = Convert.ToInt32(dt.Rows[0]["herr"]),

                };

                //graficas.Add(grafica);
            //}

            return Request.CreateResponse(HttpStatusCode.OK, counter);
        }

        public List<Graph> Post(DateRange dat)
        {
            List<Graph> graficas = new List<Graph>();
            dat.start = dat.start.Substring(0, dat.start.Length - 14);
            dat.end = dat.end.Substring(0, dat.end.Length - 14);
            string query = @"
                          exec DateRange '"
                            + dat.start + @"'
                        ,'" + dat.end + @"'
                        ";
            DataTable dt = GetData(query);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                Graph grafica = new Graph
                {
                    fecha = Convert.ToString(dt.Rows[i]["fecha"]),
                    herramienta = Convert.ToString(dt.Rows[i]["herramienta"]),
                    altas = Convert.ToInt32(dt.Rows[i]["altas"]),
                    bajas = Convert.ToInt32(dt.Rows[i]["bajas"]),
                };

                graficas.Add(grafica);
            }
            return graficas;



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