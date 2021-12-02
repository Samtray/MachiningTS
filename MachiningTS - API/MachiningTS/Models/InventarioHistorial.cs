using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MachiningTS.Models
{
    public class InventarioHistorial
    {
        public int id { get; set; }
        public string usuario { get; set; }
        public string herramienta { get; set; }
        public string nombre { get; set; }
        public string fecha { get; set; }
        public int altas { get; set; }
        public int bajas { get; set; }
    }
}