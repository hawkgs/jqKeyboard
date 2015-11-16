/* globals require */
"use strict"; // jshint ignore:line

var gulp = require("gulp"),

    // Plugins
    wrap = require("gulp-wrap"),
    clean = require("gulp-clean"),
    concat = require("gulp-concat"),
    minify = require("gulp-minify"),
    minCss = require("gulp-minify-css"),
    header = require("gulp-header"),
    replace = require("gulp-replace"),
    jeditor = require("gulp-json-editor"),

    // Helpers
    gh = require("./gulphelpers"),
    packageJson = require("./package.json"),
    buildNo = require("./buildno.json").build,
    moduleOrder;

// Module concatenation order
moduleOrder = [
    gh.modulePath("helpers"),
    gh.modulePath("visualization"),
    gh.modulePath("eventmgr"),
    gh.modulePath("uictrl"),
    gh.modulePath("core")
];

// Updates the build number
gulp.task("_update-build-no", function () {
    gulp.src("./buildno.json")
        .pipe(jeditor(function(json) {
            json.build += 1;
            return json;
        }))
        .pipe(gulp.dest("./"));

    buildNo += 1;
});

// Builds the jqkeyboard.js from the separated modules
gulp.task("default", ["_update-build-no"], function () {
    console.log("Build No. " + buildNo + " in process ...");

    return gulp.src(moduleOrder)
        //.pipe(replace(/\n/g, "    ")) // Adds tabulation to concatenated modules
        .pipe(replace(/"use strict";var/g, "")) // Removes the strict mode from modules (There is global one in wrapper)
        .pipe(replace(new RegExp("//jshint ignore:line", "g"), "")) // Removes module-specific JSHint ignored lines
        .pipe(concat("jqkeyboard.js", { newLine: "\n\n" })) // Concatenates the modules in jqkeyboard.js
        .pipe(wrap({ src: gh.DEV_DIR_PREFIX + "_main.js" })) // Wraps the modules in the IIFE
        .pipe(header(gh.uncompressedHeader, { pkg: packageJson, bld: buildNo })) // Puts a header with information
        .pipe(gulp.dest("./development/built")); // Saves at build/
});

// Alias of 'default'
gulp.task("build", ["default"]);

// Minifies jqKeyboards (independently from ./built/jqkeyboard.js)
gulp.task("_minify:js", function () {
    return gulp.src(moduleOrder)
        .pipe(replace(/"use strict";var/g, ""))
        .pipe(concat("jqkeyboard.js"))
        .pipe(wrap({ src: gh.DEV_DIR_PREFIX + "_main.js" }))
        .pipe(minify())
        .pipe(gulp.dest("./dist/"));
});

// Calls 'minify:js' and cleans the uncompressed file from ./dist/
gulp.task("_clean:js", ["_minify:js"], function () {
    return gulp.src("./dist/jqkeyboard.js")
        .pipe(clean());
});

// Minifies the currently used development theme
gulp.task("minify:css", function () {
    return gulp.src("./development/css/jqkeyboard.css")
        .pipe(minCss())
        .pipe(header(gh.compressedHeader, { pkg: packageJson, bld: buildNo })) // Adds header
        .pipe(gulp.dest("./dist/"));
});

// Executes minification of both JS and CSS, and adds header to minified js file
gulp.task("dist", ["_clean:js", "minify:css"], function () {
    return gulp.src("./dist/jqkeyboard-min.js")
        .pipe(header(gh.compressedHeader, { pkg: packageJson, bld: buildNo }))
        .pipe(gulp.dest("./dist/"));
});
