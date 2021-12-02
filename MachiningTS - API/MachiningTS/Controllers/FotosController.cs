using MachiningTS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MachiningTS.Controllers
{
    public class FotosController : ApiController
    {
        /*public HttpResponseMessage Post()
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    string time = DateTime.Now.ToString("yyyyMMdd_hhmmssfff");
                    var filePath = HttpContext.Current.Server.MapPath("~/" + time + postedFile.FileName);
                    postedFile.SaveAs(filePath);
                    docfiles.Add(filePath);
                }
                result = Request.CreateResponse(HttpStatusCode.Created, docfiles);
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return result;
        }*/
        [Route("api/fotos/borrar")]
        [HttpDelete]
        public string Delete(string img)
        {
            img = img.Remove(0, 32);
            var path = HttpContext.Current.Server.MapPath("~/img/" + img);
            if (System.IO.File.Exists(path))
            {
                // Use a try block to catch IOExceptions, to
                // handle the case of the file already being
                // opened by another process.
                try
                {
                    System.IO.File.Delete(path);
                }
                catch (System.IO.IOException e)
                {
                    Console.WriteLine(e.Message);
                    return "Algo salio mal.";
                }
            }
            return "Borrado.";

        }


        [Route("api/fotos")]
        [HttpPost]
        public string UploadFile()
        {
            try
            {
                var file = HttpContext.Current.Request.Files.Count > 0 ?
                    HttpContext.Current.Request.Files[0] : null;
                var fileName = "";
                string time = DateTime.Now.ToString("yyyyMMdd_hhmmssfff");
                if (file != null && file.ContentLength > 0)
                {
                    fileName = Path.GetFileName(file.FileName);
                    var path = HttpContext.Current.Server.MapPath("~/img/" + time + fileName);
                   // var path = "C:/Users/sammy/Escritorio/img/" + time + fileName;
                    file.SaveAs(path);

                }
                return "http://192.168.0.4/MachTest/img/" + time + fileName;
            }
            catch (Exception e)
            {
                return "Imagen no encontrada.";
            }

        }

        [Route("api/fotos/editarinv")]
        [HttpPut]
        public string Put(Foto foto)
        {
            try
            {
                string query = @"
                          exec InventarioFoto '"
                            + foto.id + @"'
                        ,'" + foto.foto + @"'
                        ";
                DataTable dt = GetData(query);
                return "Modificación exitosa.";
            }
            catch (Exception)
            {
                return "Modificación fallida.";
            }

        }

        [Route("api/fotos/editarprf")]
        [HttpPut]
        public string PutPrf(Foto2 foto)
        {
            try
            {
                string query = @"
                          exec PerfilFoto '"
                            + foto.id + @"'
                        ,'" + foto.foto + @"'
                        ";
                DataTable dt = GetData(query);
                return "Modificación exitosa.";
            }
            catch (Exception)
            {
                return "Modificación fallida.";
            }

        }

        [Route("api/fotos/editarprov")]
        [HttpPut]
        public string PutProv(Foto2 foto)
        {
            try
            {
                string query = @"
                          exec ProveedoresFoto '"
                            + foto.id + @"'
                        ,'" + foto.foto + @"'
                        ";
                DataTable dt = GetData(query);
                return "Modificación exitosa.";
            }
            catch (Exception)
            {
                return "Modificación fallida.";
            }

        }

        [Route("api/fotos/editarclie")]
        [HttpPut]
        public string PutClie(Foto2 foto)
        {
            try
            {
                string query = @"
                          exec ClientesFoto '"
                            + foto.id + @"'
                        ,'" + foto.foto + @"'
                        ";
                DataTable dt = GetData(query);
                return "Modificación exitosa.";
            }
            catch (Exception)
            {
                return "Modificación fallida.";
            }

        }

        [Route("api/fotos/editaremp")]
        [HttpPut]
        public string PutEmp(Foto2 foto)
        {
            try
            {
                string query = @"
                          exec EmpleadosFoto '"
                            + foto.id + @"'
                        ,'" + foto.foto + @"'
                        ";
                DataTable dt = GetData(query);
                return "Modificación exitosa.";
            }
            catch (Exception)
            {
                return "Modificación fallida.";
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
