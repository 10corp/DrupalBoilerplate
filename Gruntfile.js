/*global module*/


module.exports = function (grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: this.file.readJSON('package.json'),

    info: {
      sourceDir: '.',
      buildDir: 'dist',
      devDir: 'dev',
      imageDir: 'images',
      scriptsDir: 'js',
      stylesDir: 'sass',
      svgDir: 'svg',
      sourceScripts: '<%= info.sourceDir %>/<%= info.scriptsDir %>',
      sourceImages: '<%= info.sourceDir %>/<%= info.imageDir %>',
      sourceStyles: '<%= info.sourceDir %>/<%= info.stylesDir %>',
      sourceSVG: '<%= info.sourceDir %>/<%= info.svgDir %>',
      docsDir: 'docs'
    },


    compass: {
      dev: {
        options: {
          config: 'configFiles/configDev.rb',
          cssDir: '<%= info.devDir %>/css'
        }
      },
      build: {
        options: {
          config: 'configFiles/configBuild.rb',
          cssDir: '<%= info.buildDir %>/css'
        }
      }


    },


    grunticon: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= info.sourceSVG %>',
          src: ['*.svg', '*.png'],
          dest: '<%= info.devDir %>/css/icons/'
        }],
        options: {
          colors: {
            // white: 'white'
          }
        }
      },
      build: {
        files: [{
          expand: true,
          cwd: '<%= info.sourceSVG %>',
          src: ['*.svg', '*.png'],
          dest: '<%= info.buildDir %>/css/icons/'
        }],
        options: {
          colors: {
            // white: 'white'
          }
        }
      }
    },


    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '<%= info.sourceScripts %>/*.js'
      ]
    },


    jsbeautifier: {
      files: ['<%= jshint.all %>'],
      options: {
        js: {
          braceStyle: 'end-expand',
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: ' ',
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: true,
          keepArrayIndentation: false,
          keepFunctionIndentation: true,
          maxPreserveNewlines: 4,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0
        }
      }
    },


    uglify: {
      dev: {
        options: {
          preserveComments: 'all',
          beautify: {
            width: 80,
            beautify: true
          },
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        files: [{
          expand: true,
          cwd: '<%= info.sourceDir %>/js',
          src: ['**/*.js'],
          dest: '<%= info.devDir %>/js'
        }]
      },
      build: {
        options: {
          preserveComments: 'none',
          drop_console: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        files: [{
          expand: true,
          cwd: '<%= info.sourceDir %>/js',
          src: ['**/*.js'],
          dest: '<%= info.buildDir %>/js'
        }]
      }
    },

    copy:{
      dev:{
        files: [
          // images
          {expand: true,
          src: ['images/**'],
          dest: '<%= info.devDir %>'},
          // drupal templates
          {expand: true,
          src: ['templates/**'],
          dest: '<%= info.devDir %>'},
          // root drupal theme files
          {expand: true,
          src: ['<%= info.sourceDir %>/*.php'],
          dest: '<%= info.devDir %>'},
          {expand: true,
          src: ['<%= info.sourceDir %>/*.png'],
          dest: '<%= info.devDir %>'},
          {expand: true,
          src: ['<%= info.sourceDir %>/*.info'],
          dest: '<%= info.devDir %>'},
        ]
      },
      build:{
        files: [
          // images
          {expand: true,
          src: ['images/**'],
          dest: '<%= info.buildDir %>'},
          // drupal templates
          {expand: true,
          src: ['templates/**'],
          dest: '<%= info.buildDir %>'},
          // root drupal theme files
          {expand: true,
          src: ['<%= info.sourceDir %>/*.php'],
          dest: '<%= info.buildDir %>'},
          {expand: true,
          src: ['<%= info.sourceDir %>/*.png'],
          dest: '<%= info.buildDir %>'},
          {expand: true,
          src: ['<%= info.sourceDir %>/*.info'],
          dest: '<%= info.buildDir %>'},
        ]
      }
    },

    watch: {
      sass: {
        options: {
          livereload: true,
          interrupt: true
        },
        files: [
          '<%= info.sourceStyles %>/*.scss',
          '<%= info.sourceStyles %>/layouts/**/*.scss'
        ],
        tasks: ['compass:dev']
      },
      icons: {
        options: {
          livereload: true
        },
        files: ['<%= info.sourceSVG%>/*.svg'],
        tasks: ['grunticon:dev']
      },
      js: {
        options: {
          livereload: true
        },
        files: ['<%= info.sourceScripts %>/**/*.js'],
        tasks: ['js']
      },
      uglify: {
        files: ['<%= info.sourceScripts %>/**/*.js'],
        tasks: ['uglify:dev']
      },
      php: {
        files: ['<%= info.sourceDir %>/templates/*.php'],
        tasks: ['copy:dev']
      }
    }



  });


  grunt.registerTask('css', [
    'compass:dev',
    'grunticon'
  ]);


  grunt.registerTask('js', [
    'jsbeautifier',
    'jshint'
  ]);


  grunt.registerTask('src', [
    'css',
    'js'
  ]);


  grunt.registerTask('dev', [
    'src',
    'uglify:dev',
    'copy:dev',
    'watch'
  ]);


  grunt.registerTask('build', [
    'css',
    'js'
  ]);


  grunt.registerTask('docs', [
    'clean:docs',
    'jsduck'
  ]);


  grunt.registerTask('writeRev', '', function () {
    var options = this.options({
      dest: 'filerev.json'
    });
    if (options.dest) {
      grunt.file.write(options.dest, JSON.stringify(grunt.filerev.summary));
    }
  });

  return this.registerTask('default', ['build', 'docs']);
};
