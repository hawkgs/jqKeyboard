"use strict";var//jshint ignore:line
/*
 * VISUALIZATION MODULE
 * The module purpose is to render all the keyboard layouts - frame, buttons, etc.
 * */
Visualization = { //jshint ignore:line

    // ENTRY POINT
    // Creates the main frame/base of the keyboard and attaches the drag event to it.
    $$createBase: function() {
        var $body = $("body"),
            contDefaultX,
            contDefaultY;

        this.$base = $("<div>").attr("id", BASE_ID);
        this.$langCont = $("<div>").attr("id", LANG_CONT_ID);
        this.$minBtn = $("<div>").addClass(MIN_BTN_CLASS).prop("title", "Minimize");
        this.$toggleBtn = $("<div>").attr("id", TOGGLE_JQK_ID);

        if (Core.options && Core.options.icon === "dark") {
            this.$toggleBtn.addClass(DARK_ICN_CLASS);
        }

        this.$langCont.append(this.$minBtn);
        this.$base.append(this.$langCont);
        $body.append(this.$toggleBtn);

        // Creates all defined layouts
        this.createLayout();

        if (Core.options && Core.options.containment) {
            this.containment = $(Core.options.containment);
            this.containment.append(this.$base);
        } else {
            $body.append(this.$base);

            contDefaultX = $(window).outerWidth() - this.$base.outerWidth();
            contDefaultY = $(window).outerHeight() - this.$base.outerHeight();

            this.containment = [CONT_START_POINT, CONT_START_POINT, contDefaultX, contDefaultY];

            this.maintainContainment();
        }
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
            $row = $("<div>").addClass(BTN_ROW_CLASS);
            buttons = layoutObj.layout[i].split(" ");

            for (j = 0; j < buttons.length; j += 1) {
                $button = this.buildButtonFromString(buttons[j]);
                $row.append($button);
            }

            $layoutCont.append($row);
        }

        return $layoutCont;
    },

    // Returns <button> from a given command string.
    buildButtonFromString: function(button) {
        var $button = $("<button>").addClass(BUTTON_CLASS);

        // Normal/regular
        if (button.length === 1) {
            $button.addClass(NORM_BTN_CLASS)
                .data("val", button) // Container for the value.
                .html(button);
        }
        // Shift-active
        else if (button.length === 3) {
            $button.addClass(SHFT_BTN_CLASS)
                .data("val", button[0]) // Container for the current value. 'Normal' by default.
                .data("shift", button[2]) // Defines the shift value
                .data("normal", button[0]) // Defines the normal value
                .html(button[0]);
        }
        // Special
        else if (button.indexOf("<<") !== -1 && button.indexOf(">>") !== -1) {
            $button = this.createSpecialBtn($button, button);
        }

        return $button;
    },

    /* Creates a special button.
     * Special buttons: Space, Backspace, Enter, Tab, Shift, CapsLock
     * */
    createSpecialBtn: function($button, button) {
        var buttonStr = button.replace("<<", "").replace(">>", "");

        switch (buttonStr) {
            case "space":
                $button.data("val", " ");
                break;
            case "tab":
                $button.data("val", "\t");
                break;
            case "enter":
                $button.data("val", "\n");
                break;
        }

        $button.addClass(SPEC_BTN_CLASS + " " + buttonStr).html("&nbsp;");
        // NB space is needed for visual purposes .............. ^^^^^^

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
    }
};
