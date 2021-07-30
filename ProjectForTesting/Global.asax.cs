using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Optimization;
using System.Web.Routing;

namespace ProjectForTesting
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }

    public static class Extension
    {
        public static string Include(this HtmlHelper helper, string includeName, object model = null)
        {
            string includeFile = "";

            string[] files = System.IO.Directory.GetFiles(HttpContext.Current.Server.MapPath("/Views/Includes/"), 
                includeName + ".*cshtml", System.IO.SearchOption.TopDirectoryOnly);

            if (files.Length > 0)
            {
                includeFile = "/Views/Includes/" + System.IO.Path.GetFileName(files[0]);
            }

            if (model != null)
            {
                helper.RenderPartial(includeFile, model);
            }
            else
            {
                helper.RenderPartial(includeFile);
            }
            return null;
        }
    }
}
