/**
 * jqKeyboard - jQuery-based virtual keyboard
 * @version v0.1.0
 * @link https://github.com/hAWKdv/jqKeyboard#readme
 * @license MIT
 * @build 31
 */
/* globals -jqKeyboard */
var jqKeyboard = (function($) {
    "use strict";

        // CONSTANTS
    var CUST_CONT_START_OFFSET = 10,
        NORM_BTN_CLASS = "normal",
        SHFT_BTN_CLASS = "shift-b",
        SPEC_BTN_CLASS = "special",
        BUTTON_CLASS = "jqk-btn",
        LANG_BTN_CLASS = "jqk-lang-btn",
        SELECTED_ITEM_CLASS = "selected",
        HIDE_CLASS = "jqk-hide",
        BASE_ID = "jq-keyboard",
        LANG_CONT_ID = "jqk-lang-cont",
        LNG_CLASS_POSTFIX = "-lang",
        CONT_START_POINT = 0,
        LAYOUTS_LIMIT = 3,

        // MODULES
        Visualization = {},
        EventManager = {},
        Helpers = {},
        Effects = {},
        Core = {};

//
/*
 * HELPERS MODULE
 * */
Helpers = { 

    // Returns the result string after a new character is inserted/added.
    insertCharacter: function(string, selection, char) {
        return string.slice(0, selection.start) + char + string.slice(selection.end);
    },

    // Returns the result string after using backspace.
    backspaceStrManipulation: function(string, selection, caretOffset) {
        if (selection.start === 0 && selection.end === 0) {
            return string;
        }

        return string.slice(0, selection.start - caretOffset) + string.slice(selection.end);
    },

    /*
     * Credits goes to kd7
     * Source: http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
     * */
    setCaretPosition: function(elem, caretPos) {
        var range;

        if (elem !== null) {
            if (elem.createTextRange) {
                range = elem.createTextRange();

                range.move("character", caretPos);
                range.select();
            } else {
                if (elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                } else {
                    elem.focus();
                }
            }
        }
    }
};


/*
 * VISUALIZATION MODULE
 * The module purpose is to render all the keyboard layouts - frame, buttons, etc.
 * */
Visualization = { 

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
                .data("val", button[0]) // Container for the current value. 'Normal' by default.
                .data("shift", button[2]) // Defines the shift value
                .data("normal", button[0]) // Defines the normal value
                .html(button[0]);
        }
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

        $button.addClass(SPEC_BTN_CLASS);

        switch (buttonStr) {
            case "space":
                $button.data("val", " ");
                break;
            case "tab":
                $button.data("val", "\t");
                break;
        }

        $button.addClass(buttonStr);

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


/*
 * EVENTMANAGER MODULE
 * Manages all keyboard related events - button functionality, language switching, etc.
 * */
EventManager = { 
    // Module-specific constants
    SHIFT_CLASS: "." + SPEC_BTN_CLASS + ".shift",

    // Language/layout switching functionality.
    loadLanguageSwitcher: function() {
        $("." + LANG_BTN_CLASS).click(function() {
            var $this = $(this),
                newLang = $this.data("lang");

            $("." + Core.selectedLanguage + LNG_CLASS_POSTFIX).addClass(HIDE_CLASS);
            $("." + newLang + LNG_CLASS_POSTFIX).removeClass(HIDE_CLASS);
            $("." + LANG_BTN_CLASS + "." + SELECTED_ITEM_CLASS).removeClass(SELECTED_ITEM_CLASS);
            $this.addClass(SELECTED_ITEM_CLASS);

            Core.selectedLanguage = newLang;
        });
    },

    // CAPSLOCK functionality.
    loadCapsLockEvent: function() {
        var lngClass = "." + Core.selectedLanguage + LNG_CLASS_POSTFIX,
            capsLockClass = "." + SPEC_BTN_CLASS + ".capslock";

        this.onLocalButtonClick(capsLockClass, function () {
            var $this = $(this),
                $parent = $this.closest(lngClass), // Modify only selected layout

                // We are checking if the button is selected (has the respective class)
                isCapsLockOn = $this.hasClass(SELECTED_ITEM_CLASS);

            if (isCapsLockOn) {
                $this.removeClass(SELECTED_ITEM_CLASS);
            } else {
                $this.addClass(SELECTED_ITEM_CLASS);
            }

            // Set all buttons to upper or lower case
            EventManager.traverseLetterButtons($parent, !isCapsLockOn);
        });
    },

    // SHIFT functionality.
    loadShiftEvent: function() {
        var lngClass = "." + Core.selectedLanguage + LNG_CLASS_POSTFIX;

        this.onLocalButtonClick(EventManager.SHIFT_CLASS, function () {
            var $parent = $(this).closest(lngClass);

            EventManager.traverseInputButtons($parent, true, "shift");

            Core.shift = true;
            // Not using $(this) since we have to change all shift buttons
            $(EventManager.SHIFT_CLASS).addClass(SELECTED_ITEM_CLASS);
        });
    },

    // Returns all the buttons in their normal state (Opposite of .loadShiftEvent())
    unshift: function() {
        var lngClass = "." + Core.selectedLanguage + LNG_CLASS_POSTFIX,
            $shiftButtons = $(EventManager.SHIFT_CLASS),
            $parent = $shiftButtons.closest(lngClass);

        this.traverseInputButtons($parent, false, "normal");

        Core.shift = false;
        $shiftButtons.removeClass(SELECTED_ITEM_CLASS);
    },

    // Provides layout/language localized click event.
    onLocalButtonClick: function (button, handler) {
        Visualization.$base
            .find("." + Core.selectedLanguage + LNG_CLASS_POSTFIX)
            .find(button)
            .click(handler);
    },

    // Traverses through all of the letter/normal buttons.
    traverseLetterButtons: function ($parent, shouldBeUpper) {
        $parent.find("." + NORM_BTN_CLASS).each(function() {
            var $this = $(this),
                value = $this.data("val");

            if (shouldBeUpper) {
                value = value.toUpperCase();
            } else {
                value = value.toLowerCase();
            }

            $this.html(value).data("val", value);
        });
    },

    // Traverses all input buttons.
    traverseInputButtons: function ($parent, shouldBeUpper, shiftBtnValueSource) {
        this.traverseLetterButtons($parent, shouldBeUpper);

        $parent.find("." + SHFT_BTN_CLASS).each(function() {
            var $this = $(this),

                /* Select the source of the wanted button state
                 * Can be 'normal' or in 'shift' mode */
                value = $this.data(shiftBtnValueSource);

            $this.html(value).data("val", value);
        });
    },

    // BACKSPACE functionality.
    loadBackspaceEvent: function() {
        $("." + SPEC_BTN_CLASS + ".backspace").click(function() {
            EventManager.onDirectTextManip(
                function(selection, currentContent) {
                    var backspaceCaretOffset;

                    if (selection.start === selection.end) {
                        backspaceCaretOffset = 1;
                    } else {
                        backspaceCaretOffset = 0;
                    }

                    return {
                        updatedContent: Helpers.backspaceStrManipulation(currentContent, selection, backspaceCaretOffset),
                        caretOffset: -backspaceCaretOffset
                    };
                }
            );
        });
    },


    loadInputButtonEvent: function() {
        Visualization.$base
            .find("." + NORM_BTN_CLASS)
            .add("." + SHFT_BTN_CLASS)
            .add("." + SPEC_BTN_CLASS + ".space")
            .add("." + SPEC_BTN_CLASS + ".tab")
            .click(function() {
                var selectedBtnVal = $(this).data("val");

                EventManager.onDirectTextManip(
                    function(selection, currentContent) {
                        return {
                            updatedContent: Helpers.insertCharacter(currentContent, selection, selectedBtnVal),
                            caretOffset: 1
                        };
                    });

                if (Core.shift) {
                    EventManager.unshift();
                }
            });
    },

    onDirectTextManip: function(btnFunctionality) {
        var activeElemNative,
            currentContent,
            btnPressResult,
            selection;

        if (EventManager.$activeElement) {
            EventManager.resetActiveElementFocus();

            currentContent = EventManager.$activeElement.val() || "";
            activeElemNative = EventManager.$activeElement[0];

            selection = {
                start: activeElemNative.selectionStart,
                end: activeElemNative.selectionEnd
            };

            btnPressResult = btnFunctionality(selection, currentContent);

            EventManager.$activeElement.val(btnPressResult.updatedContent);
            Helpers.setCaretPosition(activeElemNative, selection.start + btnPressResult.caretOffset);
        }
    },

    // Changes the active element on each new cursor focus
    activeElementListener: function() {
        // Those are the allowed active elements
        $("input, textarea").focus(function() {
            EventManager.$activeElement = $(this);
        });
    },

    resetActiveElementFocus: function() {
        this.$activeElement.blur(function () {
            setTimeout(function () {
                EventManager.$activeElement.focus(function(event) {
                    event.stopPropagation();
                });
            }, 25);
        });
    },

    // Used for selecting which events to load at once.
    loadEvents: function() {
        this.activeElementListener();
        this.loadLanguageSwitcher();
        this.loadInputButtonEvent();
        this.loadBackspaceEvent();
        this.loadCapsLockEvent();
        this.loadShiftEvent();
    }
};


/*
 * CORE MODULE
 * Entry point of the application
 * */
Core = { 
    init: function(options) {
        if (!jqKeyboard.layouts) {
            console.error("jqKeyboard: The keyboard layout configuration file hasn't been loaded.");
            return;
        }

        Core.options = options;
        Core.selectedLanguage = null;

        Visualization.createBase();
        EventManager.loadEvents();
    }
};

    return {
        init: Core.init
    };
}(jQuery));