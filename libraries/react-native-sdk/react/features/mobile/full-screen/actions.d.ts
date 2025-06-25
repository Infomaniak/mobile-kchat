import { NativeEventSubscription } from 'react-native';
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
export declare function _setImmersiveSubscription(subscription?: NativeEventSubscription): {
    type: string;
    subscription: NativeEventSubscription | undefined;
};
