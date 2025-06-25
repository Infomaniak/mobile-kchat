"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._setImmersiveSubscription = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sets the change event listener to be used with react-native-immersive's API.
 *
 * @param {Function} subscription - The function to be used with
 * react-native-immersive's API as the change event listener.
 * @protected
 * @returns {{
 *     type: _SET_IMMERSIVE_SUBSCRIPTION,
 *     subscription: ?NativeEventSubscription
 * }}
 */
function _setImmersiveSubscription(subscription) {
    return {
        type: actionTypes_1._SET_IMMERSIVE_SUBSCRIPTION,
        subscription
    };
}
exports._setImmersiveSubscription = _setImmersiveSubscription;
