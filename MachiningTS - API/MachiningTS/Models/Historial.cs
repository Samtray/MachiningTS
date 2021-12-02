using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MachiningTS.Models
{
    public class Historial
    {
        public int id { get; set; }
        public string usuario { get; set; }
        public string foto { get; set; }
        public string fecha { get; set; }
        public string tipo { get; set; }
        public string contenido { get; set; }
    }
}