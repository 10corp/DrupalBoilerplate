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
      sourceBowerDir: '<%= info.sourceDir %>/bower_components',
      sourceScripts: '<%= info.sourceDir %>/<%= info.scriptsDir %>',
      sourceImages: '<%= info.sourceDir %>/<%= info.imageDir %>',
      sourceStyles: '<%= info.sourceDir %>/<%= info.stylesDir %>',
      buildScripts: '<%= info.buildDir %>/<%= info.scriptsDir %>',
      docsDir: 'docs'
    },


    clean: {
      css: ['<%= info.sourceDir %>/css'],
      dist: ['<%= info.buildDir %>'],
      requirejs: ['<%= info.buildDir %>/sass', '<%= info.buildDir %>/build.txt'],
      docs: ['<%= info.docsDir %>'],
      distbower: [
        '<%= info.buildDir %>/bower_components/**/*.*',
        '<%= info.buildDir %>/bower_components/**/.*',
        '<%= info.buildDir %>/bower_components/**/docs',
        '<%= info.buildDir %>/bower_components/**/test',
        '<%= info.buildDir %>/bower_components/**/examples',
        '<%= info.buildDir %>/bower_components/**/CNAME',
        '<%= info.buildDir %>/bower_components/**/Rakefile',
        '!<%= info.buildDir %>/bower_components/**/*.js',
        '<%= info.buildDir %>/bower_components/**/Gruntfile.js',
        '!<%= info.buildDir %>/bower_components/**/fonts'
      ]
    },


    compass: {
      options: {
        sassDir: '<%= info.sourceDir %>/styles',
        cssDir: '<%= info.sourceDir %>/css',
        imagesDir: '<%= info.sourceImages %>',
        javascriptsDir: '<%= info.sourceScripts %>',
        fontsDir: '<%= info.sourceDir %>/css/fonts',
        httpPath: '../',
        relativeAssets: false,
        outputStyle: 'expanded'
      },
      clean: {
        options: {
          clean: true
        }
      },
      dev: {},
      dist: {
        options: {
          sassDir: '<%= info.buildDir %>/css',
          outputStyle: 'compressed'
        }
      }
    },


    grunticon: {
      icons: {
        files: [{
          expand: true,
          cwd: '<%= info.sourceImages %>/svg/',
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


    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= info.buildDir %>/css/',
          src: ['**/*.css'],
          dest: '<%= info.buildDir %>/css/'
        }]
      }
    },

    filerev: {
      files: {
        src: [
          '<%= info.buildScripts %>/vendor/require.modernizr-custom.js',
          '<%= info.buildScripts %>/common.js'
        ]
      }
    },

    jsduck: {
      main: {
        src: [
          '<%= info.sourceBowerDir %>/fcv-js/src/scripts',
          '<%= info.sourceBowerDir %>/fcv-js/src/styles',
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
          '<%= info.sourceStyles %>/lib/**/*.scss',
          '<%= info.sourceStyles %>/base/**/*.scss',
          '<%= info.sourceStyles %>/features/**/*.scss',
          '<%= info.sourceStyles %>/vendor/**/*.scss'
        ],
        tasks: ['compass:dev', 'legacssy']
      },
      icons: {
        options: {
          livereload: true
        },
        files: ['<%= info.sourceImages %>/svg/*.svg'],
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
    'clean:css',
    // 'compass:clean',
    'compass:dev',
    'legacssy',
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
    'connect:server',
    'watch'
  ]);


  grunt.registerTask('build', [
    'css',
    'js',
    'clean:dist',
    'useminPrepare',
    'requirejs',
    'cssmin',
    'uglify',
    'filerev',
    'writeRev',
    'usemin'
    // 'clean:requirejs',
    // 'clean:distbower'
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
