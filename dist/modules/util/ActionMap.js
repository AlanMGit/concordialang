"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Actions_1 = require("./Actions");
const ActionTargets_1 = require("./ActionTargets");
/**
 * Maps an action to its default target. This is useful in cases in which
 * a UI Element is not defined, but just a UI Literal, and the UI Element type
 * or action target must be defined.
 *
 * @author Thiago Delgado Pinto
 */
exports.ACTION_TARGET_MAP = new Map([
    [Actions_1.Actions.AM_ON, ActionTargets_1.ActionTargets.URL],
    [Actions_1.Actions.APPEND, ActionTargets_1.ActionTargets.LISTBOX],
    [Actions_1.Actions.ATTACH_FILE, ActionTargets_1.ActionTargets.DIV],
    [Actions_1.Actions.CHECK, ActionTargets_1.ActionTargets.CHECKBOX],
    [Actions_1.Actions.CLEAR, ActionTargets_1.ActionTargets.TEXTBOX],
    [Actions_1.Actions.CLICK, ActionTargets_1.ActionTargets.BUTTON],
    [Actions_1.Actions.CLOSE, ActionTargets_1.ActionTargets.WINDOW],
    [Actions_1.Actions.DOUBLE_CLICK, ActionTargets_1.ActionTargets.IMAGE],
    [Actions_1.Actions.DRAG, ActionTargets_1.ActionTargets.IMAGE],
    [Actions_1.Actions.DROP, ActionTargets_1.ActionTargets.IMAGE],
    [Actions_1.Actions.FILL, ActionTargets_1.ActionTargets.TEXTBOX],
    [Actions_1.Actions.HIDE, ActionTargets_1.ActionTargets.TEXTBOX],
    [Actions_1.Actions.MOVE, ActionTargets_1.ActionTargets.CURSOR],
    [Actions_1.Actions.MOUSE_OUT, ActionTargets_1.ActionTargets.CURSOR],
    [Actions_1.Actions.MOUSE_OVER, ActionTargets_1.ActionTargets.CURSOR],
    [Actions_1.Actions.OPEN, ActionTargets_1.ActionTargets.URL],
    [Actions_1.Actions.PRESS, ActionTargets_1.ActionTargets.KEY],
    [Actions_1.Actions.REFRESH, ActionTargets_1.ActionTargets.CURRENT_PAGE],
    [Actions_1.Actions.RESIZE, ActionTargets_1.ActionTargets.WINDOW],
    [Actions_1.Actions.RIGHT_CLICK, ActionTargets_1.ActionTargets.IMAGE],
    [Actions_1.Actions.SAVE_SCREENSHOT, ActionTargets_1.ActionTargets.NONE],
    [Actions_1.Actions.SCROLL_TO, ActionTargets_1.ActionTargets.CURRENT_PAGE],
    [Actions_1.Actions.SEE, ActionTargets_1.ActionTargets.TEXT],
    [Actions_1.Actions.SELECT, ActionTargets_1.ActionTargets.SELECT],
    [Actions_1.Actions.SHOW, ActionTargets_1.ActionTargets.WINDOW],
    [Actions_1.Actions.SWIPE, ActionTargets_1.ActionTargets.SCREEN],
    [Actions_1.Actions.SWITCH, ActionTargets_1.ActionTargets.NATIVE],
    [Actions_1.Actions.TAP, ActionTargets_1.ActionTargets.BUTTON],
    [Actions_1.Actions.UNCHECK, ActionTargets_1.ActionTargets.CHECKBOX],
    [Actions_1.Actions.WAIT, ActionTargets_1.ActionTargets.TEXT]
]);
