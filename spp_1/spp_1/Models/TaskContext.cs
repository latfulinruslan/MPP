using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace spp_1.Models
{
    public class TaskContext: DbContext
    {
        public DbSet<Task> Tasks { get; set; }
    }

    public class TaskDbInitializer : DropCreateDatabaseAlways<TaskContext>
    {
        protected override void Seed(TaskContext db)
        {
            base.Seed(db);
        }
    }
}