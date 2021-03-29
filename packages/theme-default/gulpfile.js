'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */
const { series, src, dest } = require('gulp')
const sass = require('gulp-dart-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')

const noVcPrefixFile = /(index|base)/

function compile() {
  return src('./src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cssmin())
    .pipe(rename(function (path) {
      if(!noVcPrefixFile.test(path.basename)) {
        path.basename = `vc-${path.basename}`
      }
    }))
    .pipe(dest('./lib'))
}

function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('./lib/fonts'))
}

exports.build = series(compile, copyfont)
