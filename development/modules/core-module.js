"use strict";var//jshint ignore:line
/*
 * CORE MODULE
 * Entry point of the application
 * */
Core = { //jshint ignore:line
    isReadyToRun: function () {
        // Checks whether a layout script is loaded.
        if (!jqKeyboard.layouts) {
            console.error("jqKeyboard: The keyboard layout configuration file hasn't been loaded.");
            return false;
        }

        // Checks if the library is already running in the current context.
        if (this.isRunning) {
            console.error("jqKeyboard: The library is already used/running in the current context/page.");
            return false;
        }

        return true;
    },

    init: function(options) {
        if (!Core.isReadyToRun()) {
            return;
        }

        // Variables
        Core.options = options;
        Core.isRunning = true;
        Core.selectedLanguage = null;
        Core.shift = {};
        Core.capsLock = {};

        // Load modules
        Visualization.$$createBase();
        EventManager.$$loadEvents();
        UIController.$$load();
    }
};
