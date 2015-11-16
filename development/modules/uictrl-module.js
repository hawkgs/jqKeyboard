"use strict";var//jshint ignore:line
/*
 * UI CONTROLLER MODULE
 * Keeps all the ui-related stuff like movement, clicks, dragging.
 * */
UIController = { //jshint ignore:line
    attachDragToBase: function () {
        // Attaches drag event
        Visualization.$base.draggable({
            containment: Visualization.containment,
            cursor: "move",
            stop: function () {
                $(this).css({
                    width: "auto",
                    height: "auto"
                });
            }
        });
    },

    attachOnClickBtnEvent: function () {
        $("." + BUTTON_CLASS).mousedown(function () {
                var $this = $(this);

                $this.addClass(CLICKED_CLASS);

                setTimeout(function () {
                    $this.removeClass(CLICKED_CLASS);
                }, 500);
            })
            .mouseup(function () {
                $(this).removeClass(CLICKED_CLASS);
            });
    },

    load: function () {
        this.attachDragToBase();
        this.attachOnClickBtnEvent();
    }
};