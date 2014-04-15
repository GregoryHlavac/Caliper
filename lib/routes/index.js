exports.initializeRoutes = function(app) 
{  
    app.get('/', function (req, res)
    {
        res.render("index",
		{
            page_title: "Caliper :: Home Page"
		});
    });
}