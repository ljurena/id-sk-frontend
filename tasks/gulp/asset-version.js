'use strict'

const configPaths = require('../../config/paths.json')
const gulp = require('gulp')
const fs = require('fs')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const del = require('del')
const vinylPaths = require('vinyl-paths')

// check for the flag passed by the task

const isDist = taskArguments.destination === 'dist' || false

// Update assets' versions ----------
// Add all.package.json version
// ----------------------------------
gulp.task('update-assets-version', () => {
  const pkg = require('../../' + configPaths.package + 'package.json')
  fs.writeFileSync(taskArguments.destination + '/VERSION.txt', pkg.version + '\r\n')
  return gulp.src([
    taskArguments.destination + '/idsk-frontend.min.css',
    taskArguments.destination + '/idsk-frontend-ie8.min.css',
    taskArguments.destination + '/idsk-frontend.min.js'
  ])
    .pipe(vinylPaths(del))
    .pipe(gulpif(isDist,
      rename(obj => {
        obj.basename = obj.basename.replace(/(idsk.*)(?=\.min)/g, '$1-' + pkg.version)
        return obj
      })
    ))
    .pipe(gulp.dest(taskArguments.destination + '/'))
})
