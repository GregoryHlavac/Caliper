﻿[![Build Status](https://drone.io/github.com/GregoryHlavac/Caliper/status.png)](https://drone.io/github.com/GregoryHlavac/Caliper/latest)

# Caliper
=========

Caliper is an endpoint server for handling crash reports generated by [Google Breakpad] it is intended as a smaller scale alternative for projects that do not need the immense scale of [Socorro].

WARNING!
----
This is highly experimental right now as this is my first foray into node and things of that likeness, it will eventually get done but it is likely things will change drastically as it gets done, download it if you want to screw around but it doesn't do anything but accept POST'd crash dumps yet.


Caliper Relies Upon Server-Side
* [Node.JS]
* [Express 4]
* [SequelizeJS]
* [Jade]
* [Multiparty]
* [Less]
* [NConf]
* [Node-Minify]

Caliper's Client Side Uses
* [AngularJS]
* [jQuery 2.1]
* [Chart.JS]


Caliper also uses [Slate Bootstrap] and it is bundled with the source, it is the only dependency bundled.


Optional Drivers
-------------
* pg
* mysql
* Or Whatever else Sequelize can support, go look for yourself.


Installation
--------------

Foreword..

You'll need preinstalled..

Node (Preferably 0.10.26 or newer)
NPM
Bower
Grunt

```sh
git clone https://github.com/GregoryHlavac/Caliper.git
cd Caliper
npm install
bower install
grunt build
mkdir minidumps
mkdir symbols
```

Setup
--------------
As someone has shown some interest in using this..

Follow instructions above to install it.

Then pick a database (mysql, postgresql, sqlite3, mariadb)

Install that associated driver with npm into your project (As Caliper doesn't come with a default driver aside from the test runner sqlite).

Modify caliper.cfg to suite your settings (You may also pass a custom configuration file using the --cfg argument).

If you chose MySQL then you can just modify what already exists in the caliper.cfg to suite your settings. (Alternatively you can be lazy and setup mysql to be what caliper expects by default.. Which I don't recommend)

Otherwise you have to figure out the settings by yourself (Consult SequelizeJS's documentation for this)

If you specify a 'url' setting in the database setting namespace all other settings are ignored and everything needed to setup the database is extrapolated from the URL.

Once the database settings are ready, startup Caliper as you would any other node app (Except I didn't name it server or index, because I have too many of those damn files anyways).


Once the server is up and running, for the time being you have to manually add a project to the 'project' database. Just give it a name and that's all you need.

From there you can navigate to


<IP>:8080 (Or whatever port you choose, SSL isn't supported yet) and navigate to the project page using the nav.

By default (at least so far, I can't promise this will not change) Caliper listens for dumps at...

<base site>/<project_name>/submit

It supports a manual crash dump submission as well by default (You can browse to it)

The fields that Caliper expects during parsing are..
'user'
'description'
'version'
'crashdump'

All of these should be relatively self explanatory, right now only version and crashdump are technically required.

As of right now Caliper expects you to have put the symbols in the proper format into the symbols directory.

The format is the same as the breakpad test ones (ie Module_Name/Identifier/Name.sym), right now it only parses on minidump submission although at a later date it will be able to handle a backlog if something wasn't quite parsed correctly.


That's all for now!

Run Me!
-------------
```sh
node caliper
```

[Google Breakpad]: https://code.google.com/p/google-breakpad/
[Socorro]:https://github.com/mozilla/socorro
[SequelizeJS]:http://sequelizejs.com/
[Express 4]:http://expressjs.com
[Node.JS]:http://nodejs.org
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[Jade]:http://jade-lang.com/
[Multiparty]:https://github.com/andrewrk/node-multiparty
[Less]:http://lesscss.org/
[NConf]:https://github.com/flatiron/nconf
[Node-Minify]: https://github.com/srod/node-minify
[AngularJS]: http://angularjs.org/
[jQuery 2.1]: http://jquery.com/
[Chart.JS]: http://www.chartjs.org/
[Slate Bootstrap]: http://bootswatch.com/slate/
