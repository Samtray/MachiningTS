using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MachiningTS.Models
{
	public class Herramienta
	{
		public int id { get; set; }
		public string codigo { get; set; }
		public string grupo  { get; set; }
		public string medida { get; set; }
		public string filos { get; set; }
		public string tipo { get; set; }
		public string noParte { get; set; }
		public string nombre { get; set; }
		public string proveedor { get; set; }
		public DateTime ultimoMovimiento { get; set; }
		public int actual { get; set; }
		public double precio { get; set; }
		public string descripcion { get; set; }
		public string foto { get; set; }
		public string nivelInventario { get; set; }
		public int nivelBajo { get; set; }
		public int nivelMedio { get; set; }
		public int nivelAlto { get; set; }

    }
}