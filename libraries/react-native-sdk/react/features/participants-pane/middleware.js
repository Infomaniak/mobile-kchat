"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * Middleware which intercepts participants pane actions.
 *
 * @param {IStore} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(() => (next) => (action) => {
    switch (action.type) {
        case actionTypes_1.PARTICIPANTS_PANE_OPEN:
            if (typeof APP !== 'undefined') {
                APP.API.notifyParticipantsPaneToggled(true);
            }
            break;
        case actionTypes_1.PARTICIPANTS_PANE_CLOSE:
            if (typeof APP !== 'undefined') {
                APP.API.notifyParticipantsPaneToggled(false);
            }
            break;
    }
    return next(action);
});
