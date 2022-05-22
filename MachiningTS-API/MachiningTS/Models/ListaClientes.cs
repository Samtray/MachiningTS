using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MachiningTS.Models
{
    public class ListaClientes
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string telefono { get; set; }
        public string correo { get; set; }
        public string direccion { get; set; }
    }
}