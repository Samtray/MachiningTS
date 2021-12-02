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
    public class RestarController : ApiController
    {
        [HttpPost]
        public string Post(SumaResta inv)
        {


            if (inv.cambio > 0) {
                try
                {
                    string query = @"
                          exec RestarInventario '"
                                + inv.id + @"'
                        ,'" + inv.cambio + @"'
                        ";
                    DataTable dt = GetData(query);
                    return "Se ha restado exitosamente.";
                }
                catch (Exception e)
                {
                    return e.Message;
                }
            } 
            else {

                return "El numero por restar debe ser mayor a 0.";
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
