"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Action to close the participants pane.
 *
 * @returns {Object}
 */
const close = () => {
    return {
        type: actionTypes_1.PARTICIPANTS_PANE_CLOSE
    };
};
exports.close = close;
