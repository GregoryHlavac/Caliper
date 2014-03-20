exports.initializeRoutes = function(app) 
{  
    app.get('/', function (req, res)
    {
        res.render("index",
		{
		    project_name: app.nconf.get("project_name"),
            page_title: "Caliper :: Home Page"
		});
    });
}