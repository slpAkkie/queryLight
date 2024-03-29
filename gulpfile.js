const gulp = require( 'gulp' )
const fs = require( 'fs' )

const ts = require( 'gulp-typescript' )
const uglifier = require( 'gulp-uglify' )
const rename = require( 'gulp-rename' )
const sourcemap = require( 'gulp-sourcemaps' )

function compileTS() {
  return gulp.src( './src/queryLight.ts' )
    .pipe( sourcemap.init() )
    .pipe( ts( { target: 'es6' } ) )
    .pipe( uglifier() )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( sourcemap.write( './' ) )
    .pipe( gulp.dest( './dist/' ) )
}

function clear( cb ) {
  fs.rmSync( './dist', {
    force: true,
    recursive: true,
  } )

  return cb()
}

function watch( cb ) {
  gulp.watch( './src/queryLight.ts', compileTS )

  return cb()
}

module.exports.build = gulp.series( clear, compileTS )
module.exports.watch = watch
