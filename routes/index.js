exports.initializeRoutes = function(app) 
{  
    app.get('/', function (req, res)
    {
        res.send('Hello! Welcome to Root Domain.');
    });
}