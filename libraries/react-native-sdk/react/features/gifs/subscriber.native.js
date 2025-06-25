"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_sdk_1 = require("@giphy/react-native-sdk");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const function_any_1 = require("./function.any");
/**
 * Listens for changes in the number of participants to calculate the dimensions of the tile view grid and the tiles.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, function_any_1.getGifConfig)(state), 
/* listener */ (_, store) => {
    const state = store.getState();
    if ((0, function_any_1.isGifEnabled)(state)) {
        react_native_sdk_1.GiphySDK.configure({ apiKey: state['features/base/config'].giphy?.sdkKey ?? '' });
    }
}, {
    deepEquals: true
});
