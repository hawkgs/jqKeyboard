"use strict";var//jshint ignore:line
/*
 * VISUALIZATION MODULE
 * The module purpose is to render all the keyboard layouts - frame, buttons, etc.
 * */
Visualization = { //jshint ignore:line

    // Creates the main frame/base of the keyboard and attaches the drag event to it.
    createBase: function() {
        var containment,
            contDefaultX,
            contDefaultY;

        this.$base = $("<div>").attr("id", BASE_ID);
        this.$langCont = $("<div>").attr("id", LANG_CONT_ID);
        this.$base.append(this.$langCont);

        // Creates all defined layouts
        this.createLayout();

        $("body").append(this.$base);

        if (Core.options && Core.options.containment) {
            containment = $(Core.options.containment);
            Visualization.setBaseDefaultPos(containment.width(), containment.height());
        } else {
            contDefaultX = $(window).outerWidth() - this.$base.outerWidth();
            contDefaultY = $(window).outerHeight() - this.$base.outerHeight();

            containment = [CONT_START_POINT, CONT_START_POINT, contDefaultX, contDefaultY];

            this.maintainContainment();
        }

        // Attaches drag event
        this.$base.draggable({
            containment: containment,
            cursor: "move"
        });
    },

    // Keeps the user defined containment of the keyboard on window resize.
    maintainContainment: function() {
        var resizeTimer;

        $(window).resize(function() {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(function() {
                var contDefaultX = $(window).outerWidth() - Visualization.$base.outerWidth(),
                    contDefaultY = $(window).outerHeight() - Visualization.$base.outerHeight(),
                    updatedContainment = [CONT_START_POINT, CONT_START_POINT, contDefaultX, contDefaultY];

                Visualization.$base.draggable("option", "containment", updatedContainment);
            }, 100);
        });
    },

    // Sets the default/starting position of the keyboard, if the user hadn't selected containment.
    setBaseDefaultPos: function(x, y) {
        this.$base.css({
            top: x - this.$base.outerWidth() - CUST_CONT_START_OFFSET,
            left: y - this.$base.outerHeight() - CUST_CONT_START_OFFSET
        });
    },

    // Creates all defined layouts
    createLayout: function() {
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
    },

    // Creates the buttons for the specified layout.
    createButtons: function(layoutObj, idx) {
        var $layoutCont = $("<div>").addClass(layoutObj.lang + LNG_CLASS_POSTFIX),
            $row,
            $button,
            buttons,
            i, j;

        if (idx > 0) {
            $layoutCont.addClass(HIDE_CLASS);
        }

        for (i = 0; i < layoutObj.layout.length; i += 1) {
            $row = $("<div>");
            buttons = layoutObj.layout[i].split(" ");

            for (j = 0; j < buttons.length; j += 1) {
                $button = this.buildButtonFromString(buttons[j]);
                $row.append($button);
            }

            $layoutCont.append($row);
        }

        return $layoutCont;
    },

    // Returns <button> from given command string.
    buildButtonFromString: function(button) {
        var $button = $("<button>").addClass(BUTTON_CLASS);

        if (button.length === 1) {
            $button.addClass(NORM_BTN_CLASS).data("val", button).html(button);
        }
        else if (button.length === 3) {
            $button.addClass(SHFT_BTN_CLASS)
                .data("val", button[0])
                .data("shift", button[2])
                .html(button[0]);
        }
        else if (button.indexOf("<<") !== -1 && button.indexOf(">>") !== -1) {
            $button = this.createSpecialBtn($button, button);
        }

        return $button;
    },

    // Renders the language/layout switcher
    createLangSwitchBtn: function(language, idx) {
        var $button = $("<button>")
            .addClass(LANG_BTN_CLASS)
            .data("lang", language)
            .html(language.toUpperCase());

        if (idx === 0) {
            $button.addClass(SELECTED_ITEM_CLASS);
            Core.selectedLanguage = language;
        }

        this.$langCont.append($button);
    },

    /* Creates a special button.
     * Special buttons: Space, Backspace, Enter, Tab, Shift, CapsLock
     * */
    createSpecialBtn: function($button, button) {
        var buttonStr = button.replace("<<", "").replace(">>", "");

        $button.addClass(SPEC_BTN_CLASS);

        if (buttonStr === "space") {
            $button.data("val", " ").addClass("space");
        } else {
            $button.addClass(buttonStr);
        }

        return $button;
    }
};