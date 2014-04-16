module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		paths: {
			bootstrap: 'bower_components/bootstrap',
			dist: 'lib/static/dist'
		},

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
		},
		copy: {
			bootstrap: {
				files: [
					{
						src: 'lib/assets/bootswatch_slate/variables.less',
						dest: '<%= paths.bootstrap %>/less/variables.less'
					}
				]
			}
		},
		less: {
			compileBSCore: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: 'bootstrap.css.map',
					sourceMapFilename: 'lib/static/dist/css/bootstrap.css.map'
				},
				files: {
					'lib/static/dist/css/bootstrap.css': '<%= paths.bootstrap %>/less/bootstrap.less'
				}
			},
			compileBSTheme: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: 'bootstrap-theme.css.map',
					sourceMapFilename: 'lib/static/dist/css/bootstrap-theme.css.map'
				},
				files: {
					'lib/static/dist/css/bootstrap-theme.css': '<%= paths.bootstrap %>/less/theme.less'
				}
			},
			minify: {
				options: {
					cleancss: true,
					report: 'min'
				},
				files: {
					'lib/static/dist/css/bootstrap.min.css': 'lib/static/dist/css/bootstrap.css',
					'lib/static/dist/css/bootstrap-theme.min.css': 'lib/static/dist/css/bootstrap-theme.css'
				}
			}
		},
		concat: {
			bootstrap: {
				src: [
					'<%= paths.bootstrap %>/js/transition.js',
					'<%= paths.bootstrap %>/js/alert.js',
					'<%= paths.bootstrap %>/js/button.js',
					'<%= paths.bootstrap %>/js/carousel.js',
					'<%= paths.bootstrap %>/js/collapse.js',
					'<%= paths.bootstrap %>/js/dropdown.js',
					'<%= paths.bootstrap %>/js/modal.js',
					'<%= paths.bootstrap %>/js/tooltip.js',
					'<%= paths.bootstrap %>/js/popover.js',
					'<%= paths.bootstrap %>/js/scrollspy.js',
					'<%= paths.bootstrap %>/js/tab.js',
					'<%= paths.bootstrap %>/js/affix.js'
				],
				dest: 'lib/static/dist/js/bootstrap.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-cli');


	grunt.registerTask('test', ['jshint', 'mochacli']);
	grunt.registerTask('build',
		[
			'copy:bootstrap',
			'less:compileBSCore',
			'less:compileBSTheme',
			'less:minify',
			'concat:bootstrap'
		]
	);
};