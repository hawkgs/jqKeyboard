var jqKeyboard = (function($) {
    "use strict";

        // CONSTANTS
    var DEF_ALLOWED_ELEMENTS = 'input[type="text"], textarea, input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="password"], input[type="search"], input[type="month"], input[type="url"], input[type="time"], input[type="tel"], input[type="week"], input[type="number"]',
        NORM_BTN_CLASS = "normal",
        SHFT_BTN_CLASS = "shift-b",
        SPEC_BTN_CLASS = "special",
        BUTTON_CLASS = "jqk-btn",
        LANG_BTN_CLASS = "jqk-lang-btn",
        SELECTED_ITEM_CLASS = "selected",
        CLICKED_CLASS ="clicked",
        MIN_BTN_CLASS = "minimize-btn",
        TOGGLE_JQK_ID = "jqk-toggle-btn",
        BTN_ROW_CLASS = "btn-row",
        HIDE_CLASS = "jqk-hide",
        DARK_ICN_CLASS = "dark",
        BASE_ID = "jq-keyboard",
        LANG_CONT_ID = "jqk-lang-cont",
        LNG_CLASS_POSTFIX = "-lang",
        CONT_START_POINT = 0,
        LAYOUTS_LIMIT = 3,

        // MODULES
        Visualization = {},
        EventManager = {},
        Helpers = {},
        UIController = {},
        Core = {};

//<%= contents %>

    return {
        init: Core.init
    };
}(jQuery));
