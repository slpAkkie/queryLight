const gulp = require( 'gulp' )
const fs = require( 'fs' )

const ts = require( 'gulp-typescript' )
const uglifier = require( 'gulp-uglify' )

function compileTS() {
  return gulp.src( './src/queryLight.ts' )
    .pipe( ts( {
      target: 'es6'
    } ) )
    .pipe( uglifier() )
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
