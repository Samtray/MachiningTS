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
    public class ProveedoresController : ApiController
    {

        public HttpResponseMessage Get()
        {
            List<ListaProveedores> proveedores = new List<ListaProveedores>();
            DataTable dt = GetData("exec GetProveedores");
            
            for (int j = 0; j < dt.Rows.Count; j++)
            {
                ListaProveedores pro = new ListaProveedores
                {
                    id = Convert.ToInt32(dt.Rows[j]["id"]),
                    foto = Convert.ToString(dt.Rows[j]["foto"]),
                    nombre = Convert.ToString(dt.Rows[j]["nombre"]),
                    telefono = Convert.ToString(dt.Rows[j]["telefono"]),
                    correo = Convert.ToString(dt.Rows[j]["correo"]),
                    direccion = Convert.ToString(dt.Rows[j]["direccion"]),
                };

                proveedores.Add(pro);
            }

            return Request.CreateResponse(HttpStatusCode.OK, proveedores);
        }

        public HttpResponseMessage Get(int id)
        {
            List<ListaProveedores> proveedores = new List<ListaProveedores>();
            DataTable dt = GetData(string.Format("exec SelectProveedor '{0}'", id));
            ListaProveedores pro = new ListaProveedores
            {
                id = Convert.ToInt32(dt.Rows[0]["id"]),
                foto = Convert.ToString(dt.Rows[0]["foto"]),
                nombre = Convert.ToString(dt.Rows[0]["nombre"]),
                telefono = Convert.ToString(dt.Rows[0]["telefono"]),
                correo = Convert.ToString(dt.Rows[0]["correo"]),
                direccion = Convert.ToString(dt.Rows[0]["direccion"]),
            };

            proveedores.Add(pro);

        Proveedores prov = new Proveedores
        {
            proveedores = proveedores
        };

            return Request.CreateResponse(HttpStatusCode.OK, prov);
        }

        public string Post(ListaProveedores prv)
        {
            try
            {
                string query = @"
                          exec InsertProveedor '"
                            + prv.foto + @"'
                        ,'" + prv.nombre + @"'
                        ,'" + prv.telefono + @"'
                        ,'" + prv.correo + @"'
                        ,'" + prv.direccion + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }

        }

        public string Put(ListaProveedores prv)
        {
            try
            {
                string query = @"
                          exec UpdateProveedor '"
                            + prv.id + @"'
                        ,'" + prv.foto + @"'
                        ,'" + prv.nombre + @"'
                        ,'" + prv.telefono + @"'
                        ,'" + prv.correo + @"'
                        ,'" + prv.direccion + @"'
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
                string query = string.Format("exec DeleteProveedor '{0}'", id);
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
