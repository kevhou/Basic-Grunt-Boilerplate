module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    packagejson: grunt.file.readJSON('package.json'),

    paths: {
      app: '.tmp',
      dist: 'dist',
      assets: 'assets',
    },

    watch: {  
      options: {
        livereload: true
      },
      sass: {
        files: '<%= paths.assets %>styles/**/**/*.scss',
        tasks: ['sass:app']
      },
      browserify: {
        files: [
          '<%= paths.assets %>/scripts/*.js'
        ],
        tasks: ['browserify:app'],
        options: {
          livereload: true
        }
      }
    },

    sass: { 
      app: {
        files: [{
          expand: true,
          cwd: '<%= paths.assets %>/styles',
          src: ['**/*.scss'],
          dest: '<%= paths.app %>/assets/styles',
          ext: '.css'
        }],
        options: {
          sourceMap: true,
          outFile: '<%= paths.app %>/assets/styles',
          outputStyle: 'nested'
        }
      }
    },

    browserify: {
      options:      {
        transform:  [ require('grunt-react').browserify ]
      },
      app:          {
        files: [
          {
            src: ['<%= paths.assets %>/scripts/main.js'],
            dest: '<%= paths.app %>/assets/scripts/bundle.js'
          }
        ]
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= paths.app %>/assets/styles',
          src: ['*.css', '!*.min.css'],
          dest: '<%= paths.dist %>/assets/styles',
          ext: '.css'
        }]
      }
    },

    uglify: {
      options: {
        preserveComments: false,
        compress: true,
      },
      my_target: {
        files: {
          '<%= paths.dist %>/assets/scripts/bundle.js': '<%= paths.app %>/assets/scripts/bundle.js'
        }
      }
    },

    clean: {
      app: ['<%= paths.app %>'],
      dist: ['<%= paths.dist %>']
    },

    htmlmin: {
      target: {
        options: {
          removeComments:true,
          collapseWhitespace:true
        },
        files: [{
          expand: true,
          cwd: '<%= paths.assets %>/views',
          src: '*.html',
          dest: '<%= paths.dist %>'
        }]
      }
    },

    copy: {
      app: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.assets %>/images',
          dest: '<%= paths.app %>/assets/images',
          src: ['*.*']
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.app %>/assets',
          dest: '<%= paths.dist %>/assets',
          src:[
            'images/*.*',
          ]
        }]
      }
    },

    connect: {
      app: {
        options: {
          debug: true,
          open: true,
          base: [
            '<%= paths.assets %>/views', 
            '<%= paths.app %>'
          ]
        }
      }
    },

  });

  // Compile APP, Run Connect Server and then Watch for changes
  grunt.registerTask('dev', [
    'clean:app',
    'copy:app',
    'sass:app',
    'browserify:app',
  ]);

  // Compile APP, Run Connect Server and then Watch for changes
  grunt.registerTask('server', [
    'dev',
    'connect:app',
    'watch'
  ]);

  // Compile BUILD
  grunt.registerTask('build', [
    'clean:dist',
    'cssmin',
    'uglify',
    'copy:dist',
    'htmlmin',
  ]);

  // Generate ChangeLog
  grunt.registerTask('generatelog', [
    'changelog'
  ]);

};