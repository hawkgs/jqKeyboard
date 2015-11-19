"use strict";var//jshint ignore:line
/*
 * HELPERS MODULE
 * */
Helpers = { //jshint ignore:line

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

    // Returns the currently selected language class.
    getSelectedLangClass: function () {
        return "." + Core.selectedLanguage + LNG_CLASS_POSTFIX;
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