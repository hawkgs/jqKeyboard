var jqKeyboard = (function($) {
    "use strict";

    var CUST_CONT_START_OFFSET = 10,
        NORM_BTN_CLASS = "normal",
        SHFT_BTN_CLASS = "shift-b",
        SPEC_BTN_CLASS = "special",
        BUTTON_CLASS = "jqk-btn",
        LANG_BTN_CLASS = "jqk-lang-btn",
        SELECTED_LNG_CLASS = "selected",
        HIDE_CLASS = "jqk-hide",
        BASE_ID = "jq-keyboard",
        LANG_CONT_ID = "jqk-lang-cont",
        CONT_START_POINT = 0,
        LAYOUTS_LIMIT = 3,
        visualization = {},
        eventHandler = {},
        core = {};

    visualization.createBase = function() {
        var containment,
            contDefaultX,
            contDefaultY;

        this.$base = $("<div>").attr("id", BASE_ID);
        this.$langCont = $("<div>").attr("id", LANG_CONT_ID);
        this.$base.append(this.$langCont);

        this.createLayout();

        $("body").append(this.$base);

        if (core.options && core.options.containment) {
            containment = $(core.options.containment);
            visualization.setBaseDefaultPos(containment.width(), containment.height());
        } else {
            contDefaultX = $(window).outerWidth() - this.$base.outerWidth();
            contDefaultY = $(window).outerHeight() - this.$base.outerHeight();

            containment = [CONT_START_POINT, CONT_START_POINT, contDefaultX, contDefaultY];

            this.maintainContainment();
        }

        this.$base.draggable({
            containment: containment,
            cursor: "move"
        });
    };

    visualization.maintainContainment = function() {
        var resizeTimer;

        $(window).resize(function() {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(function() {
                var contDefaultX = $(window).outerWidth() - visualization.$base.outerWidth(),
                    contDefaultY = $(window).outerHeight() - visualization.$base.outerHeight(),
                    updatedContainment = [CONT_START_POINT, CONT_START_POINT, contDefaultX, contDefaultY];

                visualization.$base.draggable("option", "containment", updatedContainment);
            }, 100);
        });
    };

    visualization.setBaseDefaultPos = function(x, y) {
        this.$base.css({
            top: x - this.$base.outerWidth() - CUST_CONT_START_OFFSET,
            left: y - this.$base.outerHeight() - CUST_CONT_START_OFFSET
        });
    };

    visualization.createLayout = function() {
        var layoutsNum = jqKeyboard.layouts.length,
            $generatedLayout,
            layoutObj,
            i;

        for (i = 0; i < layoutsNum && i < LAYOUTS_LIMIT; i += 1) {
            layoutObj = jqKeyboard.layouts[i];

            $generatedLayout = this.createButtons(layoutObj, i);
            this.createLangSwitchBtn(layoutObj.lang, i);

            this.$base.append($generatedLayout);
        }

        // TODO: Remove after testing
        $(document).on("click", "button.jqk-btn", function () {
            console.log($(this).data("val"));
        });
    };

    visualization.createButtons = function(layoutObj, idx) {
        var $layoutCont = $("<div>").addClass(layoutObj.lang + "-lang"),
            $row,
            $button,
            buttons,
            button,
            i, j;

        if (idx > 0) {
            $layoutCont.addClass(HIDE_CLASS);
        }

        for (i = 0; i < layoutObj.layout.length; i += 1) {
            $row = $("<div>");
            buttons = layoutObj.layout[i].split(" ");

            for (j = 0; j < buttons.length; j += 1) {
                $button = $("<button>").addClass(BUTTON_CLASS);
                button = buttons[j];

                if (button.length === 1) {
                    $button.addClass(NORM_BTN_CLASS).data("val", button).html(button);
                } else if (button.length === 3) {
                    $button.addClass(SHFT_BTN_CLASS).data("val", { norm: button[0], shift: button[2] }).html(button[0]);
                } else if (button.indexOf("<<") !== -1 && button.indexOf(">>") !== -1) {
                    $button = this.createSpecialBtn($button, button);
                }

                $row.append($button);
            }

            $layoutCont.append($row);
        }

        return $layoutCont;
    };

    visualization.createLangSwitchBtn = function(language, idx) {
        var $button = $("<button>")
            .addClass(LANG_BTN_CLASS)
            .data("lang", language)
            .html(language.toUpperCase());

        if (idx === 0) {
            $button.addClass(SELECTED_LNG_CLASS);
            core.selectedLanguage = language;
        }

        this.$langCont.append($button);
    };

    visualization.createSpecialBtn = function($button, button) {
        var buttonStr = button.replace("<<", "").replace(">>", "");

        $button.addClass(SPEC_BTN_CLASS);

        if (buttonStr === "space") {
            $button.data("val", " ").addClass("space");
        } else {
            $button.data("oprt", buttonStr).addClass(buttonStr);
        }

        return $button;
    };

    visualization.build = function() {
        this.createBase();
    };

    eventHandler.loadLanguageSwitcher = function() {
        $("." + LANG_BTN_CLASS).click(function() {
            var $this = $(this),
                newLang = $this.data("lang");

            $("." + core.selectedLanguage + "-lang").addClass(HIDE_CLASS);
            $("." + newLang + "-lang").removeClass(HIDE_CLASS);
            $("." + LANG_BTN_CLASS + "." + SELECTED_LNG_CLASS).removeClass(SELECTED_LNG_CLASS);
            $this.addClass(SELECTED_LNG_CLASS);

            core.selectedLanguage = newLang;
        });
    };

    eventHandler.loadEvents = function() {
        this.loadLanguageSwitcher();
    };

    core.init = function(options) {
        if (!jqKeyboard.layouts) {
            console.error("jqKeyboard: The keyboard layout configuration file hasn't been loaded.");
            return;
        }

        core.options = options;

        visualization.build();
        eventHandler.loadEvents();
    };

    return {
        init: core.init
    };
}(jQuery));