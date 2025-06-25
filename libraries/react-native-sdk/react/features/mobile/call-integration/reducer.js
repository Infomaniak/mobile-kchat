"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../../base/redux/ReducerRegistry"));
const functions_1 = require("../../base/redux/functions");
const CallKit_1 = __importDefault(require("./CallKit"));
const ConnectionService_1 = __importDefault(require("./ConnectionService"));
const actionTypes_1 = require("./actionTypes");
(CallKit_1.default || ConnectionService_1.default) && ReducerRegistry_1.default.register('features/call-integration', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1._SET_CALL_INTEGRATION_SUBSCRIPTIONS:
            return (0, functions_1.set)(state, 'subscriptions', action.subscriptions);
    }
    return state;
});
