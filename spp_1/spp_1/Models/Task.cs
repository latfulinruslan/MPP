using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace spp_1.Models
{
    public class Task
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Status { get; set; }

        public DateTime Date { get; set; }

    }
}