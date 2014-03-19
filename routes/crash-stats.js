exports.initializeRoutes = function(app) 
{  
    app.get('/crash-stats', function (req, res)
    {
        res.send('Hello! Welcome to Crash-Stats.');
    });
}