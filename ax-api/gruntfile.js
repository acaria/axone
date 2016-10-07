'use strict'

module.exports = grunt => {

  require('load-grunt-tasks')(grunt);
  //require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    ts: {
      app: {
        files: [{
          src: ["src/**/*.ts", "!src/.baseDir.ts", "!src/_all.d.ts"],
          dest: "build/."
        }],
        options: {
          module: "commonjs",
          noLib: true,
          target: "es6",
          sourceMap: false
        }
      }
    },

    tslint: {
      options: {
        configuration: "tslint.json"
      },
      files: {
        src: ["src/**/*.ts"]
      }
    },
    
    watch: {
      ts: {
        files: ["js/src/**/*.ts", "src/**/*.ts"],
        tasks: ["ts", "tslint"]
      }
    },

    nodemon: {
      dev: {
        script: "build/index.js",
        option: {
          cwd: "../__dirname",
          ignore: ['node_modules/**', 'public/**'],
          env: {
            PORT: process.env.PORT || 8080
          }
        }
      }
    },

    open: {
      dev: {
        path: 'http://localhost:8080'
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch', 'open'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    clean: {
      dev : ['build/**']
    },

    shell: {
      mongodb: {
        command: 'mongod --dbpath ./data/db',
        options: {
          async: true,
          stdout: false,
          stderr: true,
          failOnError: true,
          execOptions: {
            cwd: '.'
          }
        }
      }
    },

  });

  grunt.registerTask("default", ["shell:mongodb", "ts", "tslint", "concurrent"]);
};
