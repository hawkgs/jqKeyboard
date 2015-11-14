"use strict";var//jshint ignore:line
// CORE - Entry point
Core = { //jshint ignore:line
    init: function(options) {
        if (!jqKeyboard.layouts) {
            console.error("jqKeyboard: The keyboard layout configuration file hasn't been loaded.");
            return;
        }

        Core.options = options;

        Visualization.createBase();
        EventManager.loadEvents();
    }
};