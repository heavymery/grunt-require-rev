# grunt-require-rev

> File revisioning for RequireJS dependencies.
This can be useful for caching and cache-busting with RequireJS.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-require-rev --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-require-rev');
```

## The "requireRev" task

### Overview
In your project's Gruntfile, add a section named `requireRev` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  requireRev: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.rev.algorithm
Type: `String`
Default value: `'md5'`

A string value that is used to do revisioning files.

#### options.rev.length
Type: `Number`
Default value: `8`

A number value that is used to do revisioning files.

#### options.requirejs.baseUrl
Type: `String`
Default value: `'(scripts|styles)'`

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  requireRev: {
    options: {},
    files: {
      src: [
        'dist/scripts/**/*.js',
        'dist/styles/*.css'
      ]
    }
  },
});
```

#### Custom Options

```js
grunt.initConfig({
  requireRev: {
    options: {
      rev: {
        algorithm: 'md5',
        length: 4
      },
      requirejs: {
        baseUrl: '(scripts|styles)', 
      }
    },
    files: {
      src: [
        'dist/scripts/**/*.js',
        'dist/styles/*.css'
      ]
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
