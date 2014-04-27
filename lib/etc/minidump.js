var db = require("../models"),
	lodash = require('lodash'),
	fs = require('fs'),
	Project = db.Project,
	Backlog = db.Backlog,
	Release = db.Release,
	Crash = db.Crash,
	Report = db.Report,
	StackFrame = db.StackFrame;

module.exports.handleMinidump = function() {

};

module.exports.dumpCallback = function(dumpFile, req, fields, err, stdout, stderr) {
	if(err)
	{
		console.log("Error Parsing Minidump: " + err);
	}
	else
	{
		var parsed = JSON.parse(stdout);
		var mainModule = parsed.modules[parsed.main_module];

		if(mainModule.missing_symbols)
		{
			Backlog.create(
				{
					report_uuid: dumpFile.originalFilename.replace(".dmp", ""),
					client_id: fields.user,
					description: fields.description,
					version: fields.version,
					local_file: dumpFile.path,
					missing_module: mainModule.filename,
					module_identifier: mainModule.debug_id
				})
				.success(function(bl) {
					req.project.addBacklog(bl);
				})
				.error(function(err) {
					console.log("Error Creating Backlog Item: " + err);
				});
		}
		else
		{
			Release.assureVersion(req.project, fields.version, function(rls) {
				console.log("Release: %s found/created.", rls.version);

				Crash.assureSignature(rls, parsed.crashing_thread.frames[0].function, function(crs) {
					console.log("Crash: %s found/created.", crs.signature);

					Report.assureReport(db, crs, dumpFile.originalFilename.replace(".dmp", ""), fields.user, fields.description, parsed, function(rpt) {
						console.log("Report %s Created", rpt.report_uuid);
					}, function(err) {
						console.log("Report couldn't be created.");
					});

				}, function(err) {
					console.log("Crash couldn't be created.");
				});
			}, function(err) {
				console.log("Release couldn't be created.");
			});
		}
	}
};