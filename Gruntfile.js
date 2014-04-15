module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['Gruntfile.js', 'caliper.js', 'lib/test/**/*.js', 'lib/routes/**/*.js', 'lib/models/**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		},
		mochacli: {
			options: {
				reporter: 'spec',
				bail: true
			},
			all: ['lib/test/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-cli');


	grunt.registerTask('test', ['jshint', 'mochacli']);
	grunt.registerTask('default', 'jshint');
};