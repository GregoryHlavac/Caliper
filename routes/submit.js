exports.initializeRoutes = function(app) 
{  
    app.get('/submit', function (req, res)
    {
        res.send('Hello! Welcome to Submit.');
    });
}