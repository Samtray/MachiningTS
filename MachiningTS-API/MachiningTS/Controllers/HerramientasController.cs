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
    public class HerramientasController : ApiController
    {

        public HttpResponseMessage Get()
        {
            List<Herramienta> herramientas = new List<Herramienta>();
            DataTable dt = GetData("exec GetInventario");
            
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

        public HttpResponseMessage Get(int id)
        {
                List<Herramienta> herramientas = new List<Herramienta>();
                DataTable dt = GetData(string.Format("exec SelectInventario '{0}'", id));
            Herramienta herramienta = new Herramienta
            {
                    id = Convert.ToInt32(dt.Rows[0]["id"]),
                    codigo = Convert.ToString(dt.Rows[0]["codigo"]),
                    grupo = Convert.ToString(dt.Rows[0]["grupo"]),
                    medida = Convert.ToString(dt.Rows[0]["medida"]),
                    filos = Convert.ToString(dt.Rows[0]["filos"]),
                    tipo = Convert.ToString(dt.Rows[0]["tipo"]),
                    noParte = Convert.ToString(dt.Rows[0]["noParte"]),
                    nombre = Convert.ToString(dt.Rows[0]["nombre"]),
                    proveedor = Convert.ToString(dt.Rows[0]["proveedor"]),
                    ultimoMovimiento = Convert.ToDateTime(dt.Rows[0]["ultimoMovimiento"]),
                    actual = Convert.ToInt32(dt.Rows[0]["actual"]),
                    precio = Convert.ToDouble(dt.Rows[0]["precio"]),
                    descripcion = Convert.ToString(dt.Rows[0]["descripcion"]),
                    foto = Convert.ToString(dt.Rows[0]["foto"]),
                    nivelBajo = Convert.ToInt32(dt.Rows[0]["nivelBajo"]),
                    nivelMedio = Convert.ToInt32(dt.Rows[0]["nivelMedio"]),
                    nivelAlto = Convert.ToInt32(dt.Rows[0]["nivelAlto"]),
                    nivelInventario = Convert.ToString(dt.Rows[0]["nivelInventario"]),

                };
            herramientas.Add(herramienta);

            return Request.CreateResponse(HttpStatusCode.OK, herramientas);
        }

        public string Post(Herramienta her)
        {
            try
            {
                string query = @"
                          exec InsertHerramientas '"
                            + her.codigo + @"'
                        ,'" + her.grupo + @"'
                        ,'" + her.medida + @"'
                        ,'" + her.filos + @"'
                        ,'" + her.tipo + @"'
                        ,'" + her.noParte + @"'
                        ,'" + her.nombre + @"'
                        ,'" + her.proveedor + @"'
                        ,'" + her.actual + @"'
                        ,'" + her.precio + @"'
                        ,'" + her.descripcion + @"'
                        ,'" + her.foto + @"'
                        ,'" + her.nivelInventario + @"'
                        ,'" + her.nivelBajo + @"'
                        ,'" + her.nivelMedio + @"'
                        ,'" + her.nivelAlto + @"'
                        ";
                DataTable dt = GetData(query);
                return "Se ha registrado con éxito.";
            }
            catch (Exception)
            {
                return "El registro ha fallado.";
            }

        }

        public string Put(Herramienta her)
        {
            try
            {
                string query = @"
                          exec UpdateHerramientas '"
                           + her.id + @"'
                        ,'" + her.codigo + @"'
                        ,'" + her.grupo + @"'
                        ,'" + her.medida + @"'
                        ,'" + her.filos + @"'
                        ,'" + her.tipo + @"'
                        ,'" + her.noParte + @"'
                        ,'" + her.nombre + @"'
                        ,'" + her.proveedor + @"'
                        ,'" + her.actual + @"'
                        ,'" + her.precio + @"'
                        ,'" + her.descripcion + @"'
                        ,'" + her.foto + @"'
                        ,'" + her.nivelInventario + @"'
                        ,'" + her.nivelBajo + @"'
                        ,'" + her.nivelMedio + @"'
                        ,'" + her.nivelAlto + @"'
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
                string query = string.Format("exec DeleteHerramienta '{0}'", id);
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
