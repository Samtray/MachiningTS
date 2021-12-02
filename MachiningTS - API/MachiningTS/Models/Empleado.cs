using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MachiningTS.Models
{
    public class Empleado
    {
        public string id { get; set; }
        public string nombre { get; set; }
        public string usuario { get; set; }
        public string contrasena { get; set; }
        public string foto { get; set; }
        public string rol { get; set; }
        public string ultimaSesion { get; set; }
        public int totalMovimientos { get; set; }
        public string ultimaModificacion { get; set; }
    }
}