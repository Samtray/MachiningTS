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
    public class CuentaController : ApiController
    {

        [Route("api/cuenta/contra")]
        [AllowAnonymous]
        [HttpPost]
        public IHttpActionResult GetContrasena(Login login)
        {
            try
            {
                DataTable dt = GetData(string.Format("exec SelectEmpleadoPorUsuario '{0}'", login.usuario));
                String con = Convert.ToString(dt.Rows[0]["contrasena"]);

                Contrasena contrasena = new Contrasena
                {
                    contrasena = con
                };

                return Ok(contrasena);
            }
            catch {
                return Unauthorized();
            }

        }

        [Route("api/cuenta/login")]
        [AllowAnonymous]
        [HttpPost]
        public IHttpActionResult Login(Login login) {

            try
            {
                DataTable dt = GetData(string.Format("exec SelectEmpleadoPorUsuario '{0}'", login.usuario));
                String con = Convert.ToString(dt.Rows[0]["contrasena"]);
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                //bool isCredentialValid = (login.contrasena == con);
                if (login.check == true)
                {
                    Loggeado loggeado = new Loggeado
                    {
                        usuario = Convert.ToString(dt.Rows[0]["usuario"]),
                        rol = Convert.ToString(dt.Rows[0]["rol"]),
                        accessToken = TokenGenerator.GenerateTokenJwt(login.usuario),
                    };

                    LoginPadre padre = new LoginPadre
                    {

                        userData = loggeado
                    };

                return Ok(loggeado);
                }
               else
                {
                      return Unauthorized();
                    //return Ok("Contraseña Incorrecta.");
                }
            }catch
            {
                return Unauthorized();
                //return Ok("Usuario no Encontrado.");
            }

        }

        [Route("api/cuenta/cambiarcontrasena")]
        [AllowAnonymous]
        [HttpPost]
        public string ChangeContrasena(InsertHistorial2 contra)
        {
            try
            {
                string query = @"
                          exec CambiarContra '"
                            + contra.uno + @"'
                        ,'" + contra.dos + @"'
                        ";
                DataTable dt = GetData(query);
                return "Contraseña Modificada Exitosamente.";
            }
            catch
            {
                return "Las contraseñas no coinciden.";
            }

        }

        [Route("api/cuenta/datetime")]
        [HttpPut]
        public string DateTime(string user)
        {
            try
            {
                string query = @"
                          exec LoginTimestamp '"
                            + user + @"'";
                DataTable dt = GetData(query);
                return "Hecho.";
            }
            catch
            {
                return "Hubo un error.";
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
