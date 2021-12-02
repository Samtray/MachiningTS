using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MachiningTS.Models
{
    public class Login
    {
        public string usuario { get; set; }
        public string contrasena { get; set; }
        public bool check { get; set; }
    }
}