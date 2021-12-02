using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MachiningTS.Models
{
    public class MachiningPadre
    {
        public Inventario inventario { get; set; }
        public List<ListaProveedores> proveedores { get; set; }
        public List<ListaClientes> clientes { get; set; }
    }
}