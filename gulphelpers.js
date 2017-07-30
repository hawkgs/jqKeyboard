/* globals module */
'use strict'; // jshint ignore:line

module.exports = {
  DEV_DIR_PREFIX: './development/modules/',
  uncompressedHeader:
  ['/**',
    ' * jqKeyboard - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '/* globals -jqKeyboard */',
    ''].join('\n'),

  compressedHeader: '/* jqKeyboard | v<%= pkg.version %> | <%= pkg.homepage %> | <%= pkg.license %> */\n',

  modulePath: function (name) {
    return this.DEV_DIR_PREFIX + name + '-module.js';
  }
};
