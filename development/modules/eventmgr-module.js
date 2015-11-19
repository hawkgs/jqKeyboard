"use strict";var//jshint ignore:line
/*
 * EVENTMANAGER MODULE
 * Manages all keyboard related events - button functionality, language switching, etc.
 *
 * Function description:
 * - $$....() - Entry point / module runner.
 * - _.....() - Functions out of module runner scope (sort of helpers).
 * */
EventManager = { //jshint ignore:line
    // Module-specific constants
    SHIFT_CLASS: "." + SPEC_BTN_CLASS + ".shift",
    CPSLCK_CLASS: "." + SPEC_BTN_CLASS + ".capslock",

    // Language/layout switching functionality.
    loadLanguageSwitcher: function() {
        $("." + LANG_BTN_CLASS).click(function() {
            var $this = $(this),
                newLang = $this.data("lang"),
                newLangClass = "." + newLang + LNG_CLASS_POSTFIX,
                currentLngClass = Helpers.getSelectedLangClass();

            EventManager._resetCaretOfActiveElem();

            // If already selected - abort
            if (currentLngClass === newLangClass) {
                return;
            }

            $(currentLngClass).addClass(HIDE_CLASS);
            $(newLangClass).removeClass(HIDE_CLASS);
            $("." + LANG_BTN_CLASS + "." + SELECTED_ITEM_CLASS).removeClass(SELECTED_ITEM_CLASS);
            $this.addClass(SELECTED_ITEM_CLASS);

            Core.selectedLanguage = newLang;

            // Reassign CapsLock and Shift buttons to their corresponding layout/language
            EventManager.loadCapsLockEvent();
            EventManager.loadShiftEvent();
        });
    },

    // CAPSLOCK functionality.
    loadCapsLockEvent: function() {
        var lngClass = Helpers.getSelectedLangClass();

        this._onLocalButtonClick(EventManager.CPSLCK_CLASS, function () {
            var $this, $parent;

            EventManager._resetCaretOfActiveElem();

            if (Core.shift) {
                return;
            }

            $this = $(this);
            $parent = $this.closest(lngClass); // Modify only selected layout

            if (Core.capsLock) {
                $this.removeClass(SELECTED_ITEM_CLASS);
                Core.capsLock = false;
            } else {
                $this.addClass(SELECTED_ITEM_CLASS);
                Core.capsLock = true;
            }

            // Set all buttons to upper or lower case
            EventManager._traverseLetterButtons($parent, Core.capsLock);
        });
    },

    // SHIFT functionality.
    loadShiftEvent: function() {
        var lngClass = Helpers.getSelectedLangClass();

        this._onLocalButtonClick(EventManager.SHIFT_CLASS, function () {
            var $shiftButtons = $(Helpers.getSelectedLangClass()).find(EventManager.SHIFT_CLASS),
                $parent;

            EventManager._resetCaretOfActiveElem();

            if (Core.shift) {
                EventManager._unshift();
                return;
            }

            if (Core.capsLock) {
                $(EventManager.CPSLCK_CLASS).removeClass(SELECTED_ITEM_CLASS);
                Core.capsLock = false;
            }

            $parent = $(this).closest(lngClass);

            EventManager._traverseInputButtons($parent, true, "shift");

            Core.shift = true;
            // Not using $(this) since we have to change all shift buttons
            $shiftButtons.addClass(SELECTED_ITEM_CLASS); //todo
        });
    },

    // BACKSPACE functionality.
    loadBackspaceEvent: function() {
        $("." + SPEC_BTN_CLASS + ".backspace").click(function() {
            EventManager._onActiveElemTextManipulation(
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

    // INPUT BUTTONS functionality (All those who are entering text).
    loadInputButtonEvent: function() {
        Visualization.$base
            .find("." + NORM_BTN_CLASS) // Normal
            .add("." + SHFT_BTN_CLASS) // Shift-active
            .add("." + SPEC_BTN_CLASS + ".space")
            .add("." + SPEC_BTN_CLASS + ".tab")
            .add("." + SPEC_BTN_CLASS + ".enter")
            .click(function() {
                var selectedBtnVal = $(this).data("val");

                EventManager._onActiveElemTextManipulation(function(selection, currentContent) {
                    return {
                        updatedContent: Helpers.insertCharacter(currentContent, selection, selectedBtnVal),
                        caretOffset: 1
                    };
                });

                if (Core.shift) {
                    EventManager._unshift();
                }
            });
    },

    // Changes the active element on each new cursor focus
    activeElementListener: function() {
        var allowedElements;

        // Pick user-assigned allowed elements or default ones
        if (Core.options && Core.options.allowed) {
            allowedElements = Core.options.allowed.join(", ");
        } else {
            allowedElements = DEF_ALLOWED_ELEMENTS;
        }

        // Set
        $(allowedElements).focus(function() {
            EventManager.$activeElement = $(this);
        });
    },

    // todo
    // Reassigns the current active element whenever the user clicks somewhere else (eg. keyboard buttons)
    /*reassignActiveElementFocus: function() {
        this.$activeElement.blur(function () {
            setTimeout(function () {
                EventManager.$activeElement.focus(function(event) {
                    event.stopPropagation();
                });
            }, 25);
        });
    },*/

    _onActiveElemTextManipulation: function(btnFunctionality) {
        var activeElemNative,
            currentContent,
            btnPressResult,
            selection;

        if (EventManager.$activeElement) {
            // Needs to be reassigned since you are clicking on a KB button.
            //EventManager.reassignActiveElementFocus(); todo

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

    // Resets the caret to the same position of the currently selected active element.
    _resetCaretOfActiveElem: function () {
        if (!this.$activeElement) {
            return;
        }

        Helpers.setCaretPosition(this.$activeElement[0], this.$activeElement[0].selectionStart);
    },

    // Returns all the buttons in their normal state (Opposite of .loadShiftEvent())
    _unshift: function() {
        var lngClass = Helpers.getSelectedLangClass(),
            $shiftButtons = $(Helpers.getSelectedLangClass()).find(EventManager.SHIFT_CLASS), //todo
            $parent = $shiftButtons.closest(lngClass);

        this._traverseInputButtons($parent, false, "normal");

        Core.shift = false;
        $shiftButtons.removeClass(SELECTED_ITEM_CLASS);
    },

    // Provides layout/language localized click event of a provided button.
    _onLocalButtonClick: function (button, handler) {
        Visualization.$base
            .find(Helpers.getSelectedLangClass())
            .find(button)
            .click(handler);
    },

    // Traverses through all of the letter/normal buttons.
    _traverseLetterButtons: function ($parent, shouldBeUpper) {
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

    // Traverses through all input buttons.
    _traverseInputButtons: function ($parent, shouldBeUpper, shiftBtnValueSource) {
        // Normal
        this._traverseLetterButtons($parent, shouldBeUpper);

        // Shift-active
        $parent.find("." + SHFT_BTN_CLASS).each(function() {
            var $this = $(this),

            /* Select the source of the wanted button state
             * Can be 'normal' or in 'shift' mode */
                value = $this.data(shiftBtnValueSource);

            $this.html(value).data("val", value);
        });
    },

    // ENTRY POINT
    // Used for selecting which events to load at once.
    $$loadEvents: function() {
        this.activeElementListener();
        this.loadLanguageSwitcher();
        this.loadInputButtonEvent();
        this.loadBackspaceEvent();
        this.loadCapsLockEvent();
        this.loadShiftEvent();
    }
};