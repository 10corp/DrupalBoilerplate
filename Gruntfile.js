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
      imageDir: 'images',
      scriptsDir: 'scripts',
      stylesDir: 'sass',
      svgDir: 'svg',
      sourceScripts: '<%= info.sourceDir %>/<%= info.scriptsDir %>',
      sourceImages: '<%= info.sourceDir %>/<%= info.imageDir %>',
      sourceStyles: '<%= info.sourceDir %>/<%= info.stylesDir %>',
      sourceSVG: '<%= info.sourceDir %>/<%= info.svgDir %>',
      docsDir: 'docs'
    },


    clean: {
      css: ['<%= info.sourceDir %>/css'],
      dist: ['<%= info.buildDir %>'],
      docs: ['<%= info.docsDir %>']
    },


    compass: {
      dev: {

      }


    },


    grunticon: {
      icons: {
        files: [{
          expand: true,
          cwd: '<%= info.sourceSVG %>',
          src: ['*.svg', '*.png'],
          dest: '<%= info.sourceDir %>/css/icons/'
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
        'Gruntfile.js',
        '<%= info.sourceScripts %>/*.js',
        '<%= info.sourceScripts %>/Site/**/*.js'
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
      dist: {
        options: {
          preserveComments: 'some'
          // sourceMapRoot: '/',
          // sourceMap: function (filename) {
          //   return filename.replace(/\.js$/, '.map');
          // },
          // sourceMappingURL: function (filename) {
          //   return filename.replace(/\.js$/, '.map');
          // }
        },

        files: [{
          expand: true,
          cwd: '<%= info.buildScripts %>/',
          src: ['**/*.js'],
          dest: '<%= info.buildScripts %>/'
        }]
      }
    },


    jsduck: {
      main: {
        src: [
          '<%= info.sourceScripts %>/Site',
          '<%= info.sourceScripts %>/*.js',
          '<%= info.sourceStyles %>/lib',
          '<%= info.sourceStyles %>/vendor'
        ],
        dest: 'docs',
        options: {
          title: '<%= pkg.name %>',
          categories: 'docs-assets/categories.json',
          css: 'docs-assets/styles.css',
          warnings: ['-nodoc', '-dup_member', '-link', '-link_ambiguous'],
          external: ['GLOBAL', 'Modernizr', 'respond', 'jQuery', 'jqXHR', 'underscore', 'head']
        }
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
          '<%= info.sourceStyles %>/components/**/*.scss',
          '<%= info.sourceStyles %>/layouts/**/*.scss',
          '<%= info.sourceStyles %>/features/**/*.scss',
          '<%= info.sourceStyles %>/vendor/**/*.scss'
        ],
        tasks: ['compass:dev']
      },
      icons: {
        options: {
          livereload: true
        },
        files: ['<%= info.sourceSVG%>/*.svg'],
        tasks: ['grunticon']
      },
      js: {
        options: {
          livereload: true
        },
        files: ['<%= jshint.all %>'],
        tasks: ['js']
      },
      justwatch: {
        options: {
          livereload: true
        },
        files: ['index.html']
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
