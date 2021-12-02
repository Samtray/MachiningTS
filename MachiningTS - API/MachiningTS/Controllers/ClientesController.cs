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
    public class ClientesController : ApiController
    {

        public HttpResponseMessage Get()
        {
            List<ListaClientes> clientes = new List<ListaClientes>();
            DataTable dt = GetData("exec GetClientes");
            
            for (int j = 0; j < dt.Rows.Count; j++)
            {
                ListaClientes cli = new ListaClientes
                {
                    id = Convert.ToInt32(dt.Rows[j]["id"]),
                    nombre = Convert.ToString(dt.Rows[j]["nombre"]),
                    telefono = Convert.ToString(dt.Rows[j]["telefono"]),
                    correo = Convert.ToString(dt.Rows[j]["correo"]),
                    direccion = Convert.ToString(dt.Rows[j]["direccion"]),
                };

                clientes.Add(cli);
            }


            return Request.CreateResponse(HttpStatusCode.OK, clientes);
        }

        public HttpResponseMessage Get(int id)
        {
            List<ListaClientes> clientes = new List<ListaClientes>();
            DataTable dt = GetData(string.Format("exec SelectCliente '{0}'", id));
            ListaClientes cli = new ListaClientes
            {
                id = Convert.ToInt32(dt.Rows[0]["id"]),
                nombre = Convert.ToString(dt.Rows[0]["nombre"]),
                telefono = Convert.ToString(dt.Rows[0]["telefono"]),
                correo = Convert.ToString(dt.Rows[0]["correo"]),
                direccion = Convert.ToString(dt.Rows[0]["direccion"]),
            };

            clientes.Add(cli);

            return Request.CreateResponse(HttpStatusCode.OK, clientes);
        }

        public string Post(ListaClientes cli)
        {
            try
            {
                string query = @"
                          exec InsertCliente '"
                            + cli.nombre + @"'
                        ,'" + cli.telefono + @"'
                        ,'" + cli.correo + @"'
                        ,'" + cli.direccion + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }

        }

        public string Put(ListaClientes cli)
        {
            try
            {
                string query = @"
                          exec UpdateCliente '"
                            + cli.id + @"'
                        ,'" + cli.nombre + @"'
                        ,'" + cli.telefono + @"'
                        ,'" + cli.correo + @"'
                        ,'" + cli.direccion + @"'
                        ";
                DataTable dt = GetData(query);
                return "Modificación exitosa.";
            }
            catch (Exception)
            {
                return "Modificación fallida.";
            }

        }

        public string Delete(int id)
        {
            try
            {
                string query = string.Format("exec DeleteCliente '{0}'", id);
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
