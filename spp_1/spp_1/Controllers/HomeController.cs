using spp_1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;

namespace spp_1.Controllers
{
    public class HomeController : Controller
    {
        TaskContext db = new TaskContext();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowTasks()
        {
            var tasks = db.Tasks;
            ViewBag.Tasks = tasks;
            return View(tasks);
        }

        [HttpGet]
        public ActionResult AddTask()
        {
            return View();
        }

        [HttpPost]
        public ActionResult AddTask(Task task)
        {
            db.Tasks.Add(task);
            db.SaveChanges();
            return RedirectToAction("ShowTasks");
        }

        [HttpGet]
        public ActionResult EditTask(int? id)
        {
            if (id == null)
                return HttpNotFound();
            Task task = db.Tasks.Find(id);
            if (task != null)
                return View(task);
            else
                return HttpNotFound();
        }

        [HttpPost]
        public ActionResult EditTask(Task task)
        {
            Task TaskForUpdate = db.Tasks.Find(task.Id);
            TaskForUpdate.Name = task.Name;
            TaskForUpdate.Status = task.Status;
            TaskForUpdate.Date = task.Date;
            db.Entry(TaskForUpdate).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("ShowTasks");
        }

        public ActionResult DeleteTask(int id)
        {
             Task t = new Task { Id = id };
             db.Entry(t).State = EntityState.Deleted;
             db.SaveChanges();
             return RedirectToAction("ShowTasks");
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
    }
}