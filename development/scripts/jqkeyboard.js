var jqKeyboard = (function($) {
    "use strict";

    var CUST_CONT_START_OFFSET = 10,
        NORM_BTN_CLASS = "normal",
        SHFT_BTN_CLASS = "shift-b",
        SPEC_BTN_CLASS = "special",
        BUTTON_CLASS = "jqk-btn",
        BASE_ID = "jq-keyboard",
        CONT_START_POINT = 0,
        LAYOUTS_LIMIT = 3,
        visualization = {},
        core = {};

    visualization.createBase = function() {
        var containment,
            contDefaultX,
            contDefaultY;

        this.$base = $("<div>").attr("id", BASE_ID);
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
            layoutObj,
            i;

        for (i = 0; i < layoutsNum && i < LAYOUTS_LIMIT; i += 1) {
            layoutObj = jqKeyboard.layouts[i];
            this.createButtons(layoutObj.layout);
        }

        // TODO: Remove after testing
        $(document).on("click", "button.jqk-btn", function () {
            console.log($(this).data("val"));
        });
    };

    visualization.createButtons = function(layout) {
        var $row,
            $button,
            buttons,
            button,
            i, j;

        for (i = 0; i < layout.length; i += 1) {
            $row = $("<div>");
            buttons = layout[i].split(" ");

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

            this.$base.append($row);
        }
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

    core.init = function(options) {
        if (!jqKeyboard.layouts) {
            console.error("jqKeyboard: The keyboard layout configuration file hasn't been loaded.");
            return;
        }

        core.options = options;

        visualization.build();
    };

    return {
        init: core.init
    };
}(jQuery));