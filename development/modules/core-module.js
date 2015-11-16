"use strict";var//jshint ignore:line
/*
 * CORE MODULE
 * Entry point of the application
 * */
Core = { //jshint ignore:line
    init: function(options) {
        if (!jqKeyboard.layouts) {
            console.error("jqKeyboard: The keyboard layout configuration file hasn't been loaded.");
            return;
        }

        // Variables
        Core.options = options;
        Core.selectedLanguage = null;
        Core.shift = false;
        Core.capsLock = false;

        Visualization.createBase();
        EventManager.loadEvents();
        UIController.load();
    }
};