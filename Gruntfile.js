module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['Gruntfile.js', 'caliper.js', 'test/**/*.js', 'routes/**/*.js', 'models/**/*.js'],
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
				require: ['should'],
				reporter: 'spec',
				bail: true
			},
			all: ['test/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-cli');


	grunt.registerTask('test', ['jshint', 'mochacli']);
	grunt.registerTask('default', 'jshint');
};